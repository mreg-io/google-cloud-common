import {Code} from "./code";
import {BadRequest, DebugInfo, ErrorInfo, PreconditionFailure, QuotaFailure, ResourceInfo, RetryInfo} from "./details";

interface IStatus<CodeType extends Code, Payload> {
    // The status code, which should be an enum value of
    // [google.rpc.Code][google.rpc.Code].
    code: number;

    // A developer-facing error message, which should be in English. Any
    // user-facing error message should be localized and sent in the
    // [google.rpc.Status.details][google.rpc.Status.details] field, or localized
    // by the client.
    message: string;

    status: CodeType;

    details: Payload[];
}

export interface BadRequestStatus extends IStatus<Code.INVALID_ARGUMENT | Code.OUT_OF_RANGE, BadRequest> {}
export interface PreconditionFailureStatus extends IStatus<Code.FAILED_PRECONDITION, PreconditionFailure> {}
export interface ErrorInfoStatus extends IStatus<Code.UNAUTHENTICATED | Code.PERMISSION_DENIED | Code.ABORTED, ErrorInfo> {}
export interface ResourceInfoStatus extends IStatus<Code.NOT_FOUND | Code.ALREADY_EXISTS, ResourceInfo> {}
export interface QuotaFailureStatus extends IStatus<Code.RESOURCE_EXHAUSTED, QuotaFailure> {}
export interface DebugInfoStatus extends IStatus<Code.DATA_LOSS | Code.UNKNOWN | Code.INTERNAL | Code.UNAVAILABLE | Code.DEADLINE_EXCEEDED, DebugInfo> {}

export interface RetryInfoStatus extends IStatus<Code.UNAVAILABLE | Code.ABORTED, RetryInfo> {}

// The `Status` type defines a logical error model that is suitable for
// different programming environments, including REST APIs and RPC APIs. It is
// used by [gRPC](https://github.com/grpc). Each `Status` message contains
// three pieces of data: error code, error message, and error details.
//
// You can find out more about this error model and how to work with it in the
// [API Design Guide](https://cloud.google.com/apis/design/errors).
export type Status = BadRequestStatus | PreconditionFailureStatus | ErrorInfoStatus | ResourceInfoStatus | QuotaFailureStatus | DebugInfoStatus | RetryInfoStatus;
