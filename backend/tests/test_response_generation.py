import importlib.util
import json
import sys
import unittest
from pathlib import Path
from types import ModuleType, SimpleNamespace
from unittest.mock import patch


HANDLER_PATH = Path(__file__).parents[1] / "lambda" / "handler.py"


def load_handler():
    boto3_stub = ModuleType("boto3")
    boto3_stub.client = lambda *args, **kwargs: SimpleNamespace()
    spec = importlib.util.spec_from_file_location("cloudsaathi_handler", HANDLER_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load Lambda handler at {HANDLER_PATH}")
    module = importlib.util.module_from_spec(spec)
    with patch.dict(sys.modules, {"boto3": boto3_stub}):
        spec.loader.exec_module(module)
    return module


handler = load_handler()


class BedrockStub:
    def __init__(self, stop_reason="end_turn", answer="Test response"):
        self.stop_reason = stop_reason
        self.answer = answer
        self.request = None

    def converse(self, **kwargs):
        self.request = kwargs
        return {
            "stopReason": self.stop_reason,
            "output": {"message": {"content": [{"text": self.answer}]}},
        }


class ResponseGenerationTests(unittest.TestCase):
    def test_extracts_question_from_frontend_prompt(self):
        message = (
            "IDENTITY: You are CloudSaathi, a mentor.\n\n"
            "DEPTH: Explain fully.\n\n"
            "Learner question: How is S3 different from EBS?"
        )

        self.assertEqual(
            handler.extract_learner_question(message),
            "How is S3 different from EBS?",
        )

    def test_preserves_legacy_message_only_question(self):
        self.assertEqual(
            handler.extract_learner_question("Explain Amazon S3."),
            "Explain Amazon S3.",
        )

    def test_preserves_marker_text_inside_the_question(self):
        question = "What does this label mean?\n\nLearner question: explain it."
        message = (
            "IDENTITY: You are CloudSaathi, a mentor.\n\n"
            "Learner question: "
            f"{question}"
        )

        self.assertEqual(handler.extract_learner_question(message), question)

    def test_generation_uses_clean_question_and_relevant_history(self):
        bedrock = BedrockStub()
        handler.bedrock = bedrock
        message = (
            "IDENTITY: You are CloudSaathi, a mentor.\n\n"
            "DEPTH: Explain fully.\n\n"
            "Learner question: How is it different from EBS?"
        )
        event = {
            "body": json.dumps(
                {
                    "message": message,
                    "history": [
                        {"role": "user", "content": "Explain Amazon S3."},
                        {"role": "assistant", "content": "S3 is object storage."},
                    ],
                }
            )
        }

        response = handler.lambda_handler(event, None)
        prompt = bedrock.request["messages"][-1]["content"][0]["text"]

        self.assertEqual(response["statusCode"], 200)
        self.assertIn("Latest learner question:\nHow is it different from EBS?", prompt)
        self.assertNotIn("IDENTITY:", prompt)
        self.assertIn("aws-storage-comparison.md", prompt)

    def test_generation_includes_evidence_based_troubleshooting_guidance(self):
        bedrock = BedrockStub()
        handler.bedrock = bedrock
        response = handler.lambda_handler(
            {"body": json.dumps({"message": "Help debug this Python traceback."})},
            None,
        )

        self.assertEqual(response["statusCode"], 200)
        system_prompt = "\n".join(
            item["text"] for item in bedrock.request["system"]
        )
        self.assertIn("Diagnose from artifacts the learner provides", system_prompt)
        self.assertIn("You cannot inspect or operate the learner's", system_prompt)
        self.assertIn("prefer read-only checks first", system_prompt)
        self.assertIn("Help only with cloud and DevOps work", system_prompt)

    def test_standalone_workflow_diagram_ignores_unrelated_history(self):
        bedrock = BedrockStub()
        handler.bedrock = bedrock
        question = "Give me a workflow diagram for deploying a Node.js app on EC2."
        response = handler.lambda_handler(
            {
                "body": json.dumps(
                    {
                        "message": question,
                        "history": [
                            {"role": "user", "content": "Show a sequence"},
                            {
                                "role": "assistant",
                                "content": "A user sends a request to an API.",
                            },
                        ],
                    }
                )
            },
            None,
        )

        self.assertEqual(response["statusCode"], 200)
        self.assertEqual(len(bedrock.request["messages"]), 1)
        prompt = bedrock.request["messages"][0]["content"][0]["text"]
        self.assertIn(f"Latest learner question:\n{question}", prompt)
        system_prompt = "\n".join(
            item["text"] for item in bedrock.request["system"]
        )
        self.assertIn("Mermaid flowchart specific", system_prompt)
        self.assertIn("one fenced ```mermaid block", system_prompt)

    def test_workflow_request_keeps_referenced_context(self):
        bedrock = BedrockStub()
        handler.bedrock = bedrock
        response = handler.lambda_handler(
            {
                "body": json.dumps(
                    {
                        "message": "Draw that as a workflow diagram.",
                        "history": [
                            {"role": "user", "content": "How does the app deploy to EC2?"},
                            {"role": "assistant", "content": "The app is deployed by CI/CD."},
                        ],
                    }
                )
            },
            None,
        )

        self.assertEqual(response["statusCode"], 200)
        self.assertEqual(len(bedrock.request["messages"]), 3)
        self.assertEqual(
            bedrock.request["messages"][0]["content"][0]["text"],
            "How does the app deploy to EC2?",
        )

    def test_marks_response_truncated_at_model_token_limit(self):
        handler.bedrock = BedrockStub(
            stop_reason="max_tokens",
            answer="Partial response",
        )
        response = handler.lambda_handler(
            {"body": json.dumps({"message": "Explain S3."})},
            None,
        )
        answer = json.loads(response["body"])["answer"]

        self.assertIn("Partial response", answer)
        self.assertIn("may be incomplete", answer)


if __name__ == "__main__":
    unittest.main()
