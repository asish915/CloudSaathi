# AWS Storage: S3, EBS, and EFS

Use this guide to distinguish AWS storage services by storage model and access pattern. Do not
substitute one service for another when answering a comparison or follow-up.

## Amazon S3

Amazon S3 is object storage. Objects are addressed by keys in buckets and are accessed through
the S3 API, SDKs, or tools such as the AWS CLI. S3 is not a shared POSIX file system or a block
device for an EC2 instance.

S3 provides strong read-after-write consistency for object PUT and DELETE operations. Versioning
retains multiple versions of an object; it is useful for recovery, but is not required for
consistency. Cross-Region Replication copies objects asynchronously and should not be described as
real-time file synchronization.

Bucket names must follow AWS naming rules and be unique within the AWS partition. Prefer IAM
policies and bucket policies for access control. ACLs are a legacy option and are disabled by
default for new buckets. S3 Reduced Redundancy Storage is deprecated; recommend current S3 storage
classes based on access and retention needs.

Choose S3 for object workloads such as backups, media, static assets, data lakes, and build
artifacts. Choose a file system instead when applications need shared directory and file semantics.

## Amazon EBS

Amazon EBS provides block-level volumes for EC2 instances. An operating system can format and
mount an attached volume as a disk. EBS is commonly used for boot volumes, application data, and
workloads that need block storage.

An EBS volume is normally attached to one EC2 instance at a time. EBS Multi-Attach is supported
only for eligible volume types and configurations, within one Availability Zone, and requires
applications and a cluster-aware file system designed for concurrent access. Do not describe EBS
as a general-purpose shared file system.

Choose EBS for a disk attached to an EC2 instance. Do not present managed databases such as
DynamoDB as EBS use cases.

## Amazon EFS

Amazon EFS is a managed NFS file system for Linux workloads. Multiple EC2 instances can mount the
same file system and access shared files using file-system semantics. Access requires suitable
network connectivity, mount targets, and security-group rules.

EFS is regional or, when configured as One Zone, limited to a single Availability Zone. It is not
available from every AWS Region through one file system. For access from another Region, a separate
cross-Region design is required.

Choose EFS when multiple instances need shared directories and files. Avoid promising that every
change is visible "in real time"; describe it as shared network file storage and account for normal
NFS and application-level caching behavior.

## Quick comparison

- S3: object storage accessed through APIs; best for durable, scalable object workloads.
- EBS: block storage attached to EC2; best for instance disks and block-level workloads.
- EFS: shared NFS file storage; best when multiple Linux instances need shared files.

For multiple EC2 instances that need shared files, EFS is usually the direct file-system choice.
S3 can be appropriate when each application accesses objects through the S3 API rather than
expecting a shared mounted directory. EBS is not the default shared-file solution.
