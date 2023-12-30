import {Duration} from "../well-known";

// Describes the cause of the error with structured details.
//
// Example of an error when contacting the "pubsub.googleapis.com" API when it
// is not enabled:
//
//     { "reason": "API_DISABLED"
//       "domain": "googleapis.com"
//       "metadata": {
//         "resource": "projects/123",
//         "service": "pubsub.googleapis.com"
//       }
//     }
//
// This response indicates that the pubsub.googleapis.com API is not enabled.
//
// Example of an error that is returned when attempting to create a Spanner
// instance in a region that is out of stock:
//
//     { "reason": "STOCKOUT"
//       "domain": "spanner.googleapis.com",
//       "metadata": {
//         "availableRegions": "us-central1,us-east2"
//       }
//     }
export interface ErrorInfo {
    // The reason of the error. This is a constant value that identifies the
    // proximate cause of the error. Error reasons are unique within a particular
    // domain of errors. This should be at most 63 characters and match a
    // regular expression of `[A-Z][A-Z0-9_]+[A-Z0-9]`, which represents
    // UPPER_SNAKE_CASE.
    reason: string;

    // The logical grouping to which the "reason" belongs. The error domain
    // is typically the registered service name of the tool or product that
    // generates the error. Example: "pubsub.googleapis.com". If the error is
    // generated by some common infrastructure, the error domain must be a
    // globally unique value that identifies the infrastructure. For Google API
    // infrastructure, the error domain is "googleapis.com".
    domain: string;

    // Additional structured details about this error.
    //
    // Keys should match /[a-zA-Z0-9-_]/ and be limited to 64 characters in
    // length. When identifying the current value of an exceeded limit, the units
    // should be contained in the key, not the value.  For example, rather than
    // {"instanceLimit": "100/request"}, should be returned as,
    // {"instanceLimitPerRequest": "100"}, if the client exceeds the number of
    // instances that can be created in a single (batch) request.
    metadata: Record<string, string>;
}

// Describes when the clients can retry a failed request. Clients could ignore
// the recommendation here or retry when this information is missing from error
// responses.
//
// It's always recommended that clients should use exponential backoff when
// retrying.
//
// Clients should wait until `retry_delay` amount of time has passed since
// receiving the error response before retrying.  If retrying requests also
// fail, clients should use an exponential backoff scheme to gradually increase
// the delay between retries based on `retry_delay`, until either a maximum
// number of retries have been reached or a maximum retry delay cap has been
// reached.
export interface RetryInfo {
    // Clients should wait at least this long between retrying the same request.
    retryDelay: Duration;
}

// Describes additional debugging info.
export interface DebugInfo {
    // The stack trace entries indicating where the error occurred.
    stackEntries: string[];

    // Additional debugging information provided by the server.
    detail: string;
}

// Describes how a quota check failed.
//
// For example if a daily limit was exceeded for the calling project,
// a service could respond with a QuotaFailure detail containing the project
// id and the description of the quota limit that was exceeded.  If the
// calling project hasn't enabled the service in the developer console, then
// a service could respond with the project id and set `service_disabled`
// to true.
//
// Also see RetryInfo and Help types for other details about handling a
// quota failure.
export interface QuotaFailure {
    // Describes all quota violations.
    violations: QuotaFailureViolation[];
}

// A message type used to describe a single quota violation.  For example, a
// daily quota or a custom quota that was exceeded.
export interface QuotaFailureViolation {
    // The subject on which the quota check failed.
    // For example, "clientip:<ip address of client>" or "project:<Google
    // developer project id>".
    subject: string;

    // A description of how the quota check failed. Clients can use this
    // description to find more about the quota configuration in the service's
    // public documentation, or find the relevant quota limit to adjust through
    // developer console.
    //
    // For example: "Service disabled" or "Daily Limit for read operations
    // exceeded".
    description: string;
}

// Describes what preconditions have failed.
//
// For example, if an RPC failed because it required the Terms of Service to be
// acknowledged, it could list the terms of service violation in the
// PreconditionFailure message.
export interface PreconditionFailure {
    // Describes all precondition violations.
    violations: PreconditionFailureViolation[];
}

// A message type used to describe a single precondition failure.
export interface PreconditionFailureViolation {
    // The type of PreconditionFailure. We recommend using a service-specific
    // enum type to define the supported precondition violation subjects. For
    // example, "TOS" for "Terms of Service violation".
    type: string;

    // The subject, relative to the type, that failed.
    // For example, "google.com/cloud" relative to the "TOS" type would indicate
    // which terms of service is being referenced.
    subject: string;

    // A description of how the precondition failed. Developers can use this
    // description to understand how to fix the failure.
    //
    // For example: "Terms of service not accepted".
    description: string;
}

// Describes violations in a client request. This error type focuses on the
// syntactic aspects of the request.
export interface BadRequest {
    fieldViolations: FieldViolation[];
}

// A message type used to describe a single bad request field.
export interface FieldViolation {
    // A path that leads to a field in the request body. The value will be a
    // sequence of dot-separated identifiers that identify a protocol buffer
    // field.
    //
    // Consider the following:
    //
    //     message CreateContactRequest {
    //       message EmailAddress {
    //         enum Type {
    //           TYPE_UNSPECIFIED = 0;
    //           HOME = 1;
    //           WORK = 2;
    //         }
    //
    //         optional string email = 1;
    //         repeated EmailType type = 2;
    //       }
    //
    //       string full_name = 1;
    //       repeated EmailAddress email_addresses = 2;
    //     }
    //
    // In this example, in proto `field` could take one of the following values:
    //
    // * `full_name` for a violation in the `full_name` value
    // * `email_addresses[1].email` for a violation in the `email` field of the
    //   first `email_addresses` message
    // * `email_addresses[3].type[2]` for a violation in the second `type`
    //   value in the third `email_addresses` message.
    //
    // In JSON, the same values are represented as:
    //
    // * `fullName` for a violation in the `fullName` value
    // * `emailAddresses[1].email` for a violation in the `email` field of the
    //   first `emailAddresses` message
    // * `emailAddresses[3].type[2]` for a violation in the second `type`
    //   value in the third `emailAddresses` message.
    field: string;

    // A description of why the request element is bad.
    description: string;
}

// Describes the resource that is being accessed.
export interface ResourceInfo {
    // A name for the type of resource being accessed, e.g. "sql table",
    // "cloud storage bucket", "file", "Google calendar"; or the type URL
    // of the resource: e.g. "type.googleapis.com/google.pubsub.v1.Topic".
    resourceType: string;

    // The name of the resource being accessed.  For example, a shared calendar
    // name: "example.com_4fghdhgsrgh@group.calendar.google.com", if the current
    // error is
    // [google.rpc.Code.PERMISSION_DENIED][google.rpc.Code.PERMISSION_DENIED].
    resourceName: string;

    // The owner of the resource (optional).
    // For example, "user:<owner email>" or "project:<Google developer project
    // id>".
    owner?: string;

    // Describes what error is encountered when accessing this resource.
    // For example, updating a cloud project may require the `writer` permission
    // on the developer console project.
    description: string;
}
