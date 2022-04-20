// @flow

import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { type GraphQLResolveInfo, type GraphQLScalarType, type GraphQLScalarTypeConfig } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type $RequireFields<Origin, Keys> = $Diff<Origin, Keys> & $ObjMapi<Keys, <Key>(k: Key) => $NonMaybeType<$ElementType<Origin, Key>>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type CompleteSelfServiceLoginFlowWithPasswordMethodInput = {
  /** Sending the anti-csrf token is only required for browser login flows. */
  csrfToken?: InputMaybe<Scalars['String']>;
  /** Identifier is the email or username of the user trying to log in. */
  identifier?: InputMaybe<Scalars['String']>;
  /** The user's password. */
  password?: InputMaybe<Scalars['String']>;
};

export type CompleteSelfServiceSettingsFlowWithPasswordMethodInput = {
  /**
   * CSRFToken is the anti-CSRF token
   *
   * type: string
   */
  csrfToken?: InputMaybe<Scalars['String']>;
  /**
   * Password is the updated password
   *
   * type: string
   */
  password: Scalars['String'];
};

export type CreateIdentityInput = {
  /** SchemaID is the ID of the JSON Schema to be used for validating the identity's traits. */
  schemaId: Scalars['String'];
  /**
   * Traits represent an identity's traits. The identity is able to create, modify, and delete traits
   * in a self-service manner. The input will always be validated against the JSON Schema defined
   * in `schema_url`.
   */
  traits: Scalars['JSON'];
};

export type CreateRecoveryLinkInput = {
  /**
   * Link Expires In
   *
   * The recovery link will expire at that point in time. Defaults to the configuration value of
   * `selfservice.flows.recovery.request_lifespan`.
   */
  expiresIn?: InputMaybe<Scalars['String']>;
  identityId: Scalars['String'];
};

export type ErrorContainer = {
  __typename?: 'ErrorContainer';
  /** Errors in the container */
  errors: Array<Maybe<Scalars['JSON']>>;
  id: Scalars['String'];
};

export type HealthAlive = {
  __typename?: 'HealthAlive';
  /** Always "ok". */
  status: Scalars['String'];
};

export type HealthReady = {
  __typename?: 'HealthReady';
  /** Always "ok". */
  status: Scalars['String'];
};

export type Identity = {
  __typename?: 'Identity';
  id: Scalars['String'];
  /** RecoveryAddresses contains all the addresses that can be used to recover an identity. */
  recoveryAddresses?: Maybe<Array<Maybe<RecoveryAddress>>>;
  /** SchemaID is the ID of the JSON Schema to be used for validating the identity's traits. */
  schemaId: Scalars['String'];
  /**
   * SchemaURL is the URL of the endpoint where the identity's traits schema can be fetched from.
   *
   * format: url
   */
  schemaUrl: Scalars['String'];
  traits: Scalars['JSON'];
  /** VerifiableAddresses contains all the addresses that can be verified by the user. */
  verifiableAddresses?: Maybe<Array<Maybe<VerifiableAddress>>>;
};

/**
 * This object represents a login flow. A login flow is initiated at the "Initiate Login API / Browser Flow"
 * endpoint by a client.
 *
 * Once a login flow is completed successfully, a session cookie or session token will be issued.
 */
export type LoginFlow = {
  __typename?: 'LoginFlow';
  /** and so on. */
  active?: Maybe<Scalars['String']>;
  /**
   * ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to log in,
   * a new flow has to be initiated.
   */
  expiresAt: Scalars['String'];
  /** Forced stores whether this login flow should enforce re-authentication. */
  forced?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  /** IssuedAt is the time (UTC) when the flow started. */
  issuedAt: Scalars['String'];
  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used
   * to forward information contained in the URL's path or query for example.
   */
  requestUrl: Scalars['String'];
  /** The flow type can either be `api` or `browser`. */
  type: Scalars['String'];
  /** Container represents a HTML Form. The container can work with both HTTP Form and JSON requests */
  ui: UiContainer;
};

/** The Response for Login Flows via API */
export type LoginViaApiResponse = {
  __typename?: 'LoginViaApiResponse';
  session: Session;
  /**
   * The Session Token
   *
   * A session token is equivalent to a session cookie, but it can be sent in the HTTP Authorization
   * Header:
   *
   * Authorization: bearer ${session-token}
   *
   * The session token is only issued for API flows, not for Browser flows!
   */
  sessionToken: Scalars['String'];
};

/** Root Mutation */
export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Use this endpoint to complete a login flow by sending an identity's identifier and password. This endpoint
   * behaves differently for API and browser flows.
   *
   * API flows expect `application/json` to be sent in the body and responds with
   * HTTP 200 and a application/json body with the session token on success;
   * HTTP 302 redirect to a fresh login flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after login URL or the `return_to` value if it was set and if the login succeeded;
   * a HTTP 302 redirect to the login UI URL with the flow ID containing the validation errors otherwise.
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API POST /self-service/login/methods/password
   */
  completeSelfServiceLoginFlowWithPasswordMethod?: Maybe<LoginViaApiResponse>;
  /**
   * Use this endpoint to complete a registration flow by sending an identity's traits and password. This endpoint
   * behaves differently for API and browser flows.
   *
   * API flows expect `application/json` to be sent in the body and respond with
   * HTTP 200 and a application/json body with the created identity success - if the session hook is configured the
   * `session` and `session_token` will also be included;
   * HTTP 302 redirect to a fresh registration flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after registration URL or the `return_to` value if it was set and if the registration succeeded;
   * a HTTP 302 redirect to the registration UI URL with the flow ID containing the validation errors otherwise.
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API POST /self-service/registration/methods/password
   */
  completeSelfServiceRegistrationFlowWithPasswordMethod?: Maybe<RegistrationViaApiResponse>;
  /**
   * This endpoint creates an identity. It is NOT possible to set an identity's credentials (password, ...)
   * using this method! A way to achieve that will be introduced in the future.
   *
   * Learn how identities work in [Ory Kratos' User And Identity Model Documentation](https://www.ory.sh/docs/next/kratos/concepts/identity-user-model).
   *
   * Equivalent to Ory Kratos API POST /identities
   */
  createIdentity?: Maybe<Identity>;
  /**
   * This endpoint creates a recovery link which should be given to the user in order for them to recover
   * (or activate) their account.
   *
   * Equivalent to Ory Kratos API POST /recovery/link
   */
  createRecoveryLink?: Maybe<RecoveryLink>;
  /** A viewer that wraps operations for all available authentication mechanisms */
  mutationViewerAnyAuth?: Maybe<MutationViewerAnyAuth>;
  /** , in OAS 'Ory Kratos API */
  mutationViewerApiKey?: Maybe<MutationViewerApiKey>;
  ping?: Maybe<Scalars['String']>;
  /**
   * This endpoint updates an identity. It is NOT possible to set an identity's credentials (password, ...)
   * using this method! A way to achieve that will be introduced in the future.
   *
   * The full identity payload (except credentials) is expected. This endpoint does not support patching.
   *
   * Learn how identities work in [Ory Kratos' User And Identity Model Documentation](https://www.ory.sh/docs/next/kratos/concepts/identity-user-model).
   *
   * Equivalent to Ory Kratos API PUT /identities/{id}
   */
  updateIdentity?: Maybe<Identity>;
};


/** Root Mutation */
export type MutationCompleteSelfServiceLoginFlowWithPasswordMethodArgs = {
  completeSelfServiceLoginFlowWithPasswordMethodInput?: InputMaybe<CompleteSelfServiceLoginFlowWithPasswordMethodInput>;
  flow: Scalars['String'];
};


/** Root Mutation */
export type MutationCompleteSelfServiceRegistrationFlowWithPasswordMethodArgs = {
  flow?: InputMaybe<Scalars['String']>;
  selfServiceRegistrationMethodsPasswordInput?: InputMaybe<Scalars['JSON']>;
};


/** Root Mutation */
export type MutationCreateIdentityArgs = {
  createIdentityInput?: InputMaybe<CreateIdentityInput>;
};


/** Root Mutation */
export type MutationCreateRecoveryLinkArgs = {
  createRecoveryLinkInput?: InputMaybe<CreateRecoveryLinkInput>;
};


/** Root Mutation */
export type MutationMutationViewerAnyAuthArgs = {
  sessionCookie?: InputMaybe<SessionCookieInput>;
  sessionToken?: InputMaybe<SessionTokenInput>;
};


/** Root Mutation */
export type MutationMutationViewerApiKeyArgs = {
  apiKey: Scalars['String'];
};


/** Root Mutation */
export type MutationUpdateIdentityArgs = {
  id: Scalars['String'];
  updateIdentityInput?: InputMaybe<UpdateIdentityInput>;
};

/** Warning: Not every request will work with this viewer type */
export type MutationViewerAnyAuth = {
  __typename?: 'MutationViewerAnyAuth';
  /**
   * Use this endpoint to complete a settings flow by sending an identity's updated password. This endpoint
   * behaves differently for API and browser flows.
   *
   * API-initiated flows expect `application/json` to be sent in the body and respond with
   * HTTP 200 and an application/json body with the session token on success;
   * HTTP 302 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   * HTTP 401 when the endpoint is called without a valid session token.
   * HTTP 403 when `selfservice.flows.settings.privileged_session_max_age` was reached.
   * Implies that the user needs to re-authenticate.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after settings URL or the `return_to` value if it was set and if the flow succeeded;
   * a HTTP 302 redirect to the Settings UI URL with the flow ID containing the validation errors otherwise.
   * a HTTP 302 redirect to the login endpoint when `selfservice.flows.settings.privileged_session_max_age` was reached.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API POST /self-service/settings/methods/password
   */
  completeSelfServiceSettingsFlowWithPasswordMethod?: Maybe<SettingsViaApiResponse>;
  /**
   * Use this endpoint to complete a settings flow by sending an identity's updated traits. This endpoint
   * behaves differently for API and browser flows.
   *
   * API-initiated flows expect `application/json` to be sent in the body and respond with
   * HTTP 200 and an application/json body with the session token on success;
   * HTTP 302 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   * HTTP 401 when the endpoint is called without a valid session token.
   * HTTP 403 when `selfservice.flows.settings.privileged_session_max_age` was reached and a sensitive field was
   * updated (e.g. recovery email). Implies that the user needs to re-authenticate.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after settings URL or the `return_to` value if it was set and if the flow succeeded;
   * a HTTP 302 redirect to the settings UI URL with the flow ID containing the validation errors otherwise.
   * a HTTP 302 redirect to the login endpoint when `selfservice.flows.settings.privileged_session_max_age` was reached.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API POST /self-service/settings/methods/profile
   */
  completeSelfServiceSettingsFlowWithProfileMethod?: Maybe<SettingsFlow>;
};


/** Warning: Not every request will work with this viewer type */
export type MutationViewerAnyAuthCompleteSelfServiceSettingsFlowWithPasswordMethodArgs = {
  completeSelfServiceSettingsFlowWithPasswordMethodInput?: InputMaybe<CompleteSelfServiceSettingsFlowWithPasswordMethodInput>;
  flow?: InputMaybe<Scalars['String']>;
};


/** Warning: Not every request will work with this viewer type */
export type MutationViewerAnyAuthCompleteSelfServiceSettingsFlowWithProfileMethodArgs = {
  flow?: InputMaybe<Scalars['String']>;
  selfServiceSettingsMethodsProfileInput?: InputMaybe<Scalars['JSON']>;
};

/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type MutationViewerApiKey = {
  __typename?: 'MutationViewerApiKey';
  /**
   * Use this endpoint to complete a settings flow by sending an identity's updated password. This endpoint
   * behaves differently for API and browser flows.
   *
   * API-initiated flows expect `application/json` to be sent in the body and respond with
   * HTTP 200 and an application/json body with the session token on success;
   * HTTP 302 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   * HTTP 401 when the endpoint is called without a valid session token.
   * HTTP 403 when `selfservice.flows.settings.privileged_session_max_age` was reached.
   * Implies that the user needs to re-authenticate.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after settings URL or the `return_to` value if it was set and if the flow succeeded;
   * a HTTP 302 redirect to the Settings UI URL with the flow ID containing the validation errors otherwise.
   * a HTTP 302 redirect to the login endpoint when `selfservice.flows.settings.privileged_session_max_age` was reached.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API POST /self-service/settings/methods/password
   */
  completeSelfServiceSettingsFlowWithPasswordMethod?: Maybe<SettingsViaApiResponse>;
  /**
   * Use this endpoint to complete a settings flow by sending an identity's updated traits. This endpoint
   * behaves differently for API and browser flows.
   *
   * API-initiated flows expect `application/json` to be sent in the body and respond with
   * HTTP 200 and an application/json body with the session token on success;
   * HTTP 302 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   * HTTP 401 when the endpoint is called without a valid session token.
   * HTTP 403 when `selfservice.flows.settings.privileged_session_max_age` was reached and a sensitive field was
   * updated (e.g. recovery email). Implies that the user needs to re-authenticate.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after settings URL or the `return_to` value if it was set and if the flow succeeded;
   * a HTTP 302 redirect to the settings UI URL with the flow ID containing the validation errors otherwise.
   * a HTTP 302 redirect to the login endpoint when `selfservice.flows.settings.privileged_session_max_age` was reached.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API POST /self-service/settings/methods/profile
   */
  completeSelfServiceSettingsFlowWithProfileMethod?: Maybe<SettingsFlow>;
};


/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type MutationViewerApiKeyCompleteSelfServiceSettingsFlowWithPasswordMethodArgs = {
  completeSelfServiceSettingsFlowWithPasswordMethodInput?: InputMaybe<CompleteSelfServiceSettingsFlowWithPasswordMethodInput>;
  flow?: InputMaybe<Scalars['String']>;
};


/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type MutationViewerApiKeyCompleteSelfServiceSettingsFlowWithProfileMethodArgs = {
  flow?: InputMaybe<Scalars['String']>;
  selfServiceSettingsMethodsProfileInput?: InputMaybe<Scalars['JSON']>;
};

/** Root Query */
export type Query = {
  __typename?: 'Query';
  /**
   * This endpoint returns the error associated with a user-facing self service errors.
   *
   * This endpoint supports stub values to help you implement the error UI:
   *
   * `?error=stub:500` - returns a stub 500 (Internal Server Error) error.
   *
   * More information can be found at [Ory Kratos User User Facing Error Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-facing-errors).
   *
   * Equivalent to Ory Kratos API GET /self-service/errors
   */
  errorContainer?: Maybe<ErrorContainer>;
  /**
   * This endpoint returns a login flow's context with, for example, error details and other information.
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API GET /self-service/login/flows
   */
  getSelfServiceLoginFlow?: Maybe<LoginFlow>;
  /**
   * This endpoint returns a recovery flow's context with, for example, error details and other information.
   *
   * More information can be found at [Ory Kratos Account Recovery Documentation](../self-service/flows/account-recovery.mdx).
   *
   * Equivalent to Ory Kratos API GET /self-service/recovery/flows
   */
  getSelfServiceRecoveryFlow?: Maybe<RecoveryFlow>;
  /**
   * This endpoint returns a registration flow's context with, for example, error details and other information.
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API GET /self-service/registration/flows
   */
  getSelfServiceRegistrationFlow?: Maybe<RegistrationFlow>;
  /**
   * This endpoint returns a verification flow's context with, for example, error details and other information.
   *
   * More information can be found at [Ory Kratos Email and Phone Verification Documentation](https://www.ory.sh/docs/kratos/selfservice/flows/verify-email-account-activation).
   *
   * Equivalent to Ory Kratos API GET /self-service/verification/flows
   */
  getSelfServiceVerificationFlow?: Maybe<VerificationFlow>;
  /**
   * This endpoint returns a HTTP 200 status code when Ory Kratos is accepting incoming
   * HTTP requests. This status does currently not include checks whether the database connection is working.
   *
   * If the service supports TLS Edge Termination, this endpoint does not require the
   * `X-Forwarded-Proto` header to be set.
   *
   * Be aware that if you are running multiple nodes of this service, the health status will never
   * refer to the cluster state, only to a single instance.
   *
   * Equivalent to Ory Kratos API GET /health/alive
   */
  healthAlive?: Maybe<HealthAlive>;
  /**
   * This endpoint returns a HTTP 200 status code when Ory Kratos is up running and the environment dependencies (e.g.
   * the database) are responsive as well.
   *
   * If the service supports TLS Edge Termination, this endpoint does not require the
   * `X-Forwarded-Proto` header to be set.
   *
   * Be aware that if you are running multiple nodes of Ory Kratos, the health status will never
   * refer to the cluster state, only to a single instance.
   *
   * Equivalent to Ory Kratos API GET /health/ready
   */
  healthReady?: Maybe<HealthReady>;
  /**
   * Lists all identities. Does not support search at the moment.
   *
   * Learn how identities work in [Ory Kratos' User And Identity Model Documentation](https://www.ory.sh/docs/next/kratos/concepts/identity-user-model).
   *
   * Equivalent to Ory Kratos API GET /identities
   */
  identities?: Maybe<Array<Maybe<Identity>>>;
  /**
   * Learn how identities work in [Ory Kratos' User And Identity Model Documentation](https://www.ory.sh/docs/next/kratos/concepts/identity-user-model).
   *
   * Equivalent to Ory Kratos API GET /identities/{id}
   */
  identity?: Maybe<Identity>;
  /**
   * Get a Traits Schema Definition
   *
   * Equivalent to Ory Kratos API GET /schemas/{id}
   */
  jsonSchema?: Maybe<Scalars['JSON']>;
  /**
   * This endpoint initiates a login flow for API clients such as mobile devices, smart TVs, and so on.
   *
   * If a valid provided session cookie or session token is provided, a 400 Bad Request error
   * will be returned unless the URL query parameter `?refresh=true` is set.
   *
   * To fetch an existing login flow call `/self-service/login/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks, including CSRF login attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API GET /self-service/login/api
   */
  loginFlow?: Maybe<LoginFlow>;
  ping?: Maybe<Scalars['String']>;
  /**
   * This endpoint initiates a recovery flow for API clients such as mobile devices, smart TVs, and so on.
   *
   * If a valid provided session cookie or session token is provided, a 400 Bad Request error.
   *
   * To fetch an existing recovery flow call `/self-service/recovery/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos Account Recovery Documentation](../self-service/flows/account-recovery.mdx).
   *
   * Equivalent to Ory Kratos API GET /self-service/recovery/api
   */
  recoveryFlow?: Maybe<RecoveryFlow>;
  /**
   * This endpoint initiates a registration flow for API clients such as mobile devices, smart TVs, and so on.
   *
   * If a valid provided session cookie or session token is provided, a 400 Bad Request error
   * will be returned unless the URL query parameter `?refresh=true` is set.
   *
   * To fetch an existing registration flow call `/self-service/registration/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API GET /self-service/registration/api
   */
  registrationFlow?: Maybe<RegistrationFlow>;
  /**
   * This endpoint initiates a verification flow for API clients such as mobile devices, smart TVs, and so on.
   *
   * To fetch an existing verification flow call `/self-service/verification/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos Email and Phone Verification Documentation](https://www.ory.sh/docs/kratos/selfservice/flows/verify-email-account-activation).
   *
   * Equivalent to Ory Kratos API GET /self-service/verification/api
   */
  verificationFlow?: Maybe<VerificationFlow>;
  /**
   * This endpoint returns the version of Ory Kratos.
   *
   * If the service supports TLS Edge Termination, this endpoint does not require the
   * `X-Forwarded-Proto` header to be set.
   *
   * Be aware that if you are running multiple nodes of this service, the version will never
   * refer to the cluster state, only to a single instance.
   *
   * Equivalent to Ory Kratos API GET /version
   */
  version?: Maybe<Version>;
  /** A viewer that wraps operations for all available authentication mechanisms */
  viewerAnyAuth?: Maybe<ViewerAnyAuth>;
  /** , in OAS 'Ory Kratos API */
  viewerApiKey?: Maybe<ViewerApiKey>;
};


/** Root Query */
export type QueryErrorContainerArgs = {
  error: Scalars['String'];
};


/** Root Query */
export type QueryGetSelfServiceLoginFlowArgs = {
  id: Scalars['String'];
};


/** Root Query */
export type QueryGetSelfServiceRecoveryFlowArgs = {
  id: Scalars['String'];
};


/** Root Query */
export type QueryGetSelfServiceRegistrationFlowArgs = {
  id: Scalars['String'];
};


/** Root Query */
export type QueryGetSelfServiceVerificationFlowArgs = {
  id: Scalars['String'];
};


/** Root Query */
export type QueryIdentitiesArgs = {
  page?: InputMaybe<Scalars['BigInt']>;
  perPage?: InputMaybe<Scalars['BigInt']>;
};


/** Root Query */
export type QueryIdentityArgs = {
  id: Scalars['String'];
};


/** Root Query */
export type QueryJsonSchemaArgs = {
  id: Scalars['String'];
};


/** Root Query */
export type QueryLoginFlowArgs = {
  refresh?: InputMaybe<Scalars['Boolean']>;
};


/** Root Query */
export type QueryViewerAnyAuthArgs = {
  sessionCookie?: InputMaybe<SessionCookieInput>;
  sessionToken?: InputMaybe<SessionTokenInput>;
};


/** Root Query */
export type QueryViewerApiKeyArgs = {
  apiKey: Scalars['String'];
};

export type RecoveryAddress = {
  __typename?: 'RecoveryAddress';
  id: Scalars['String'];
  value: Scalars['String'];
  via: Scalars['String'];
};

/**
 * This request is used when an identity wants to recover their account.
 *
 * We recommend reading the [Account Recovery Documentation](../self-service/flows/password-reset-account-recovery)
 */
export type RecoveryFlow = {
  __typename?: 'RecoveryFlow';
  /**
   * Active, if set, contains the registration method that is being used. It is initially
   * not set.
   */
  active?: Maybe<Scalars['String']>;
  /**
   * ExpiresAt is the time (UTC) when the request expires. If the user still wishes to update the setting,
   * a new request has to be initiated.
   */
  expiresAt: Scalars['String'];
  id: Scalars['String'];
  /** IssuedAt is the time (UTC) when the request occurred. */
  issuedAt: Scalars['String'];
  messages?: Maybe<Array<Maybe<UiText>>>;
  /**
   * Methods contains context for all account recovery methods. If a registration request has been
   * processed, but for example the password is incorrect, this will contain error messages.
   */
  methods: Scalars['JSON'];
  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used
   * to forward information contained in the URL's path or query for example.
   */
  requestUrl: Scalars['String'];
  state: Scalars['String'];
  /** The flow type can either be `api` or `browser`. */
  type?: Maybe<Scalars['String']>;
};

export type RecoveryLink = {
  __typename?: 'RecoveryLink';
  /**
   * Recovery Link Expires At
   *
   * The timestamp when the recovery link expires.
   */
  expiresAt?: Maybe<Scalars['String']>;
  /**
   * Recovery Link
   *
   * This link can be used to recover the account.
   */
  recoveryLink: Scalars['String'];
};

export type RegistrationFlow = {
  __typename?: 'RegistrationFlow';
  /** and so on. */
  active?: Maybe<Scalars['String']>;
  /**
   * ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to log in,
   * a new flow has to be initiated.
   */
  expiresAt: Scalars['String'];
  id: Scalars['String'];
  /** IssuedAt is the time (UTC) when the flow occurred. */
  issuedAt: Scalars['String'];
  messages?: Maybe<Array<Maybe<UiText>>>;
  /**
   * Methods contains context for all enabled registration methods. If a registration flow has been
   * processed, but for example the password is incorrect, this will contain error messages.
   */
  methods: Scalars['JSON'];
  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used
   * to forward information contained in the URL's path or query for example.
   */
  requestUrl: Scalars['String'];
  /** The flow type can either be `api` or `browser`. */
  type?: Maybe<Scalars['String']>;
};

/** The Response for Registration Flows via API */
export type RegistrationViaApiResponse = {
  __typename?: 'RegistrationViaApiResponse';
  identity: Identity;
  session?: Maybe<Session>;
  /**
   * The Session Token
   *
   * This field is only set when the session hook is configured as a post-registration hook.
   *
   * A session token is equivalent to a session cookie, but it can be sent in the HTTP Authorization
   * Header:
   *
   * Authorization: bearer ${session-token}
   *
   * The session token is only issued for API flows, not for Browser flows!
   */
  sessionToken: Scalars['String'];
};

export type Session = {
  __typename?: 'Session';
  active?: Maybe<Scalars['Boolean']>;
  authenticatedAt: Scalars['String'];
  expiresAt: Scalars['String'];
  id: Scalars['String'];
  identity: Identity;
  issuedAt: Scalars['String'];
};

/** API key credentials for the security protocol 'sessionCookie' in Ory Kratos API */
export type SessionCookieInput = {
  apiKey?: InputMaybe<Scalars['String']>;
};

/** API key credentials for the security protocol 'sessionToken' in Ory Kratos API */
export type SessionTokenInput = {
  apiKey?: InputMaybe<Scalars['String']>;
};

/**
 * This flow is used when an identity wants to update settings
 * (e.g. profile data, passwords, ...) in a selfservice manner.
 *
 * We recommend reading the [User Settings Documentation](../self-service/flows/user-settings)
 */
export type SettingsFlow = {
  __typename?: 'SettingsFlow';
  /**
   * Active, if set, contains the registration method that is being used. It is initially
   * not set.
   */
  active?: Maybe<Scalars['String']>;
  /**
   * ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to update the setting,
   * a new flow has to be initiated.
   */
  expiresAt: Scalars['String'];
  id: Scalars['String'];
  identity: Identity;
  /** IssuedAt is the time (UTC) when the flow occurred. */
  issuedAt: Scalars['String'];
  messages?: Maybe<Array<Maybe<UiText>>>;
  /**
   * Methods contains context for all enabled registration methods. If a settings flow has been
   * processed, but for example the first name is empty, this will contain error messages.
   */
  methods: Scalars['JSON'];
  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used
   * to forward information contained in the URL's path or query for example.
   */
  requestUrl: Scalars['String'];
  state: Scalars['String'];
  /** The flow type can either be `api` or `browser`. */
  type?: Maybe<Scalars['String']>;
};

/** The Response for Settings Flows via API */
export type SettingsViaApiResponse = {
  __typename?: 'SettingsViaApiResponse';
  /**
   * This flow is used when an identity wants to update settings
   * (e.g. profile data, passwords, ...) in a selfservice manner.
   *
   * We recommend reading the [User Settings Documentation](../self-service/flows/user-settings)
   */
  flow: SettingsFlow;
  identity: Identity;
};

/** Container represents a HTML Form. The container can work with both HTTP Form and JSON requests */
export type UiContainer = {
  __typename?: 'UiContainer';
  /** Action should be used as the form action URL `<form action="{{ .Action }}" method="post">`. */
  action: Scalars['String'];
  messages?: Maybe<Array<Maybe<UiText>>>;
  /** Method is the form method (e.g. POST) */
  method: Scalars['String'];
  nodes: Array<Maybe<UiNode>>;
};

/**
 * Nodes are represented as HTML elements or their native UI equivalents. For example,
 * a node can be an `<img>` tag, or an `<input element>` but also `some plain text`.
 */
export type UiNode = {
  __typename?: 'UiNode';
  attributes: UiNodeAttributes;
  group: Scalars['String'];
  messages: Array<Maybe<UiText>>;
  type: Scalars['String'];
};

export type UiNodeAnchorAttributes = {
  __typename?: 'UiNodeAnchorAttributes';
  /**
   * The link's href (destination) URL.
   *
   * format: uri
   */
  href: Scalars['String'];
  title: UiText;
};

/** No description available. */
export type UiNodeAttributes = UiNodeAnchorAttributes | UiNodeImageAttributes | UiNodeInputAttributes | UiNodeTextAttributes;

export type UiNodeImageAttributes = {
  __typename?: 'UiNodeImageAttributes';
  /**
   * The image's source URL.
   *
   * format: uri
   */
  src: Scalars['String'];
};

/** InputAttributes represents the attributes of an input node */
export type UiNodeInputAttributes = {
  __typename?: 'UiNodeInputAttributes';
  /** Sets the input's disabled field to true or false. */
  disabled: Scalars['Boolean'];
  label?: Maybe<UiText>;
  /** The input's element name. */
  name: Scalars['String'];
  /** The input's pattern. */
  pattern?: Maybe<Scalars['String']>;
  /** Mark this input field as required. */
  required?: Maybe<Scalars['Boolean']>;
  type: Scalars['String'];
  value?: Maybe<Scalars['JSON']>;
};

export type UiNodeTextAttributes = {
  __typename?: 'UiNodeTextAttributes';
  text: UiText;
};

export type UiText = {
  __typename?: 'UiText';
  /** The message's context. Useful when customizing messages. */
  context?: Maybe<Scalars['JSON']>;
  id: Scalars['BigInt'];
  /** The message text. Written in american english. */
  text: Scalars['String'];
  type: Scalars['String'];
};

export type UpdateIdentityInput = {
  /**
   * SchemaID is the ID of the JSON Schema to be used for validating the identity's traits. If set
   * will update the Identity's SchemaID.
   */
  schemaId?: InputMaybe<Scalars['String']>;
  /**
   * Traits represent an identity's traits. The identity is able to create, modify, and delete traits
   * in a self-service manner. The input will always be validated against the JSON Schema defined
   * in `schema_id`.
   */
  traits: Scalars['JSON'];
};

export type VerifiableAddress = {
  __typename?: 'VerifiableAddress';
  id: Scalars['String'];
  status: Scalars['String'];
  value: Scalars['String'];
  verified: Scalars['Boolean'];
  verifiedAt?: Maybe<Scalars['String']>;
  via: Scalars['String'];
};

/**
 * Used to verify an out-of-band communication
 * channel such as an email address or a phone number.
 *
 * For more information head over to: https://www.ory.sh/docs/kratos/selfservice/flows/verify-email-account-activation
 */
export type VerificationFlow = {
  __typename?: 'VerificationFlow';
  /**
   * Active, if set, contains the registration method that is being used. It is initially
   * not set.
   */
  active?: Maybe<Scalars['String']>;
  /**
   * ExpiresAt is the time (UTC) when the request expires. If the user still wishes to verify the address,
   * a new request has to be initiated.
   */
  expiresAt?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  /** IssuedAt is the time (UTC) when the request occurred. */
  issuedAt?: Maybe<Scalars['String']>;
  messages?: Maybe<Array<Maybe<UiText>>>;
  /**
   * Methods contains context for all account verification methods. If a registration request has been
   * processed, but for example the password is incorrect, this will contain error messages.
   */
  methods: Scalars['JSON'];
  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used
   * to forward information contained in the URL's path or query for example.
   */
  requestUrl?: Maybe<Scalars['String']>;
  state: Scalars['String'];
  /** The flow type can either be `api` or `browser`. */
  type: Scalars['String'];
};

export type Version = {
  __typename?: 'Version';
  /** The version of Ory Kratos. */
  version: Scalars['String'];
};

/** Warning: Not every request will work with this viewer type */
export type ViewerAnyAuth = {
  __typename?: 'ViewerAnyAuth';
  /**
   * When accessing this endpoint through Ory Kratos' Public API you must ensure that either the Ory Kratos Session Cookie
   * or the Ory Kratos Session Token are set. The public endpoint does not return 404 status codes
   * but instead 403 or 500 to improve data privacy.
   *
   * You can access this endpoint without credentials when using Ory Kratos' Admin API.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API GET /self-service/settings/flows
   */
  getSelfServiceSettingsFlow?: Maybe<SettingsFlow>;
  /**
   * Uses the HTTP Headers in the GET request to determine (e.g. by using checking the cookies) who is authenticated.
   * Returns a session object in the body or 401 if the credentials are invalid or no credentials were sent.
   * Additionally when the request it successful it adds the user ID to the 'X-Kratos-Authenticated-Identity-Id' header in the response.
   *
   * This endpoint is useful for reverse proxies and API Gateways.
   *
   * Equivalent to Ory Kratos API GET /sessions/whoami
   */
  session?: Maybe<Session>;
  /**
   * This endpoint initiates a settings flow for API clients such as mobile devices, smart TVs, and so on.
   * You must provide a valid Ory Kratos Session Token for this endpoint to respond with HTTP 200 OK.
   *
   * To fetch an existing settings flow call `/self-service/settings/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API GET /self-service/settings/api
   */
  settingsFlow?: Maybe<SettingsFlow>;
};


/** Warning: Not every request will work with this viewer type */
export type ViewerAnyAuthGetSelfServiceSettingsFlowArgs = {
  id: Scalars['String'];
};


/** Warning: Not every request will work with this viewer type */
export type ViewerAnyAuthSessionArgs = {
  authorization?: InputMaybe<Scalars['String']>;
  cookie?: InputMaybe<Scalars['String']>;
};

/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type ViewerApiKey = {
  __typename?: 'ViewerApiKey';
  /**
   * When accessing this endpoint through Ory Kratos' Public API you must ensure that either the Ory Kratos Session Cookie
   * or the Ory Kratos Session Token are set. The public endpoint does not return 404 status codes
   * but instead 403 or 500 to improve data privacy.
   *
   * You can access this endpoint without credentials when using Ory Kratos' Admin API.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API GET /self-service/settings/flows
   */
  getSelfServiceSettingsFlow?: Maybe<SettingsFlow>;
  /**
   * Uses the HTTP Headers in the GET request to determine (e.g. by using checking the cookies) who is authenticated.
   * Returns a session object in the body or 401 if the credentials are invalid or no credentials were sent.
   * Additionally when the request it successful it adds the user ID to the 'X-Kratos-Authenticated-Identity-Id' header in the response.
   *
   * This endpoint is useful for reverse proxies and API Gateways.
   *
   * Equivalent to Ory Kratos API GET /sessions/whoami
   */
  session?: Maybe<Session>;
  /**
   * This endpoint initiates a settings flow for API clients such as mobile devices, smart TVs, and so on.
   * You must provide a valid Ory Kratos Session Token for this endpoint to respond with HTTP 200 OK.
   *
   * To fetch an existing settings flow call `/self-service/settings/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API GET /self-service/settings/api
   */
  settingsFlow?: Maybe<SettingsFlow>;
};


/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type ViewerApiKeyGetSelfServiceSettingsFlowArgs = {
  id: Scalars['String'];
};


/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type ViewerApiKeySessionArgs = {
  authorization?: InputMaybe<Scalars['String']>;
  cookie?: InputMaybe<Scalars['String']>;
};

export type Unnamed_1_QueryVariables = Exact<{ [key: string]: never; }>;


export type Unnamed_1_Query = { __typename?: 'Query', ping?: string | null };



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CompleteSelfServiceLoginFlowWithPasswordMethodInput: CompleteSelfServiceLoginFlowWithPasswordMethodInput;
  CompleteSelfServiceSettingsFlowWithPasswordMethodInput: CompleteSelfServiceSettingsFlowWithPasswordMethodInput;
  CreateIdentityInput: CreateIdentityInput;
  CreateRecoveryLinkInput: CreateRecoveryLinkInput;
  ErrorContainer: ResolverTypeWrapper<ErrorContainer>;
  HealthAlive: ResolverTypeWrapper<HealthAlive>;
  HealthReady: ResolverTypeWrapper<HealthReady>;
  Identity: ResolverTypeWrapper<Identity>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  LoginFlow: ResolverTypeWrapper<LoginFlow>;
  LoginViaApiResponse: ResolverTypeWrapper<LoginViaApiResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  MutationViewerAnyAuth: ResolverTypeWrapper<MutationViewerAnyAuth>;
  MutationViewerApiKey: ResolverTypeWrapper<MutationViewerApiKey>;
  Query: ResolverTypeWrapper<{}>;
  RecoveryAddress: ResolverTypeWrapper<RecoveryAddress>;
  RecoveryFlow: ResolverTypeWrapper<RecoveryFlow>;
  RecoveryLink: ResolverTypeWrapper<RecoveryLink>;
  RegistrationFlow: ResolverTypeWrapper<RegistrationFlow>;
  RegistrationViaApiResponse: ResolverTypeWrapper<RegistrationViaApiResponse>;
  Session: ResolverTypeWrapper<Session>;
  SessionCookieInput: SessionCookieInput;
  SessionTokenInput: SessionTokenInput;
  SettingsFlow: ResolverTypeWrapper<SettingsFlow>;
  SettingsViaApiResponse: ResolverTypeWrapper<SettingsViaApiResponse>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UiContainer: ResolverTypeWrapper<UiContainer>;
  UiNode: ResolverTypeWrapper<Omit<UiNode, 'attributes'> & { attributes: ResolversTypes['UiNodeAttributes'] }>;
  UiNodeAnchorAttributes: ResolverTypeWrapper<UiNodeAnchorAttributes>;
  UiNodeAttributes: ResolversTypes['UiNodeAnchorAttributes'] | ResolversTypes['UiNodeImageAttributes'] | ResolversTypes['UiNodeInputAttributes'] | ResolversTypes['UiNodeTextAttributes'];
  UiNodeImageAttributes: ResolverTypeWrapper<UiNodeImageAttributes>;
  UiNodeInputAttributes: ResolverTypeWrapper<UiNodeInputAttributes>;
  UiNodeTextAttributes: ResolverTypeWrapper<UiNodeTextAttributes>;
  UiText: ResolverTypeWrapper<UiText>;
  UpdateIdentityInput: UpdateIdentityInput;
  VerifiableAddress: ResolverTypeWrapper<VerifiableAddress>;
  VerificationFlow: ResolverTypeWrapper<VerificationFlow>;
  Version: ResolverTypeWrapper<Version>;
  ViewerAnyAuth: ResolverTypeWrapper<ViewerAnyAuth>;
  ViewerApiKey: ResolverTypeWrapper<ViewerApiKey>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: Scalars['BigInt'];
  Boolean: Scalars['Boolean'];
  CompleteSelfServiceLoginFlowWithPasswordMethodInput: CompleteSelfServiceLoginFlowWithPasswordMethodInput;
  CompleteSelfServiceSettingsFlowWithPasswordMethodInput: CompleteSelfServiceSettingsFlowWithPasswordMethodInput;
  CreateIdentityInput: CreateIdentityInput;
  CreateRecoveryLinkInput: CreateRecoveryLinkInput;
  ErrorContainer: ErrorContainer;
  HealthAlive: HealthAlive;
  HealthReady: HealthReady;
  Identity: Identity;
  JSON: Scalars['JSON'];
  LoginFlow: LoginFlow;
  LoginViaApiResponse: LoginViaApiResponse;
  Mutation: {};
  MutationViewerAnyAuth: MutationViewerAnyAuth;
  MutationViewerApiKey: MutationViewerApiKey;
  Query: {};
  RecoveryAddress: RecoveryAddress;
  RecoveryFlow: RecoveryFlow;
  RecoveryLink: RecoveryLink;
  RegistrationFlow: RegistrationFlow;
  RegistrationViaApiResponse: RegistrationViaApiResponse;
  Session: Session;
  SessionCookieInput: SessionCookieInput;
  SessionTokenInput: SessionTokenInput;
  SettingsFlow: SettingsFlow;
  SettingsViaApiResponse: SettingsViaApiResponse;
  String: Scalars['String'];
  UiContainer: UiContainer;
  UiNode: Omit<UiNode, 'attributes'> & { attributes: ResolversParentTypes['UiNodeAttributes'] };
  UiNodeAnchorAttributes: UiNodeAnchorAttributes;
  UiNodeAttributes: ResolversParentTypes['UiNodeAnchorAttributes'] | ResolversParentTypes['UiNodeImageAttributes'] | ResolversParentTypes['UiNodeInputAttributes'] | ResolversParentTypes['UiNodeTextAttributes'];
  UiNodeImageAttributes: UiNodeImageAttributes;
  UiNodeInputAttributes: UiNodeInputAttributes;
  UiNodeTextAttributes: UiNodeTextAttributes;
  UiText: UiText;
  UpdateIdentityInput: UpdateIdentityInput;
  VerifiableAddress: VerifiableAddress;
  VerificationFlow: VerificationFlow;
  Version: Version;
  ViewerAnyAuth: ViewerAnyAuth;
  ViewerApiKey: ViewerApiKey;
};

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export type ErrorContainerResolvers<ContextType = any, ParentType extends ResolversParentTypes['ErrorContainer'] = ResolversParentTypes['ErrorContainer']> = {
  errors?: Resolver<Array<Maybe<ResolversTypes['JSON']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HealthAliveResolvers<ContextType = any, ParentType extends ResolversParentTypes['HealthAlive'] = ResolversParentTypes['HealthAlive']> = {
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type HealthReadyResolvers<ContextType = any, ParentType extends ResolversParentTypes['HealthReady'] = ResolversParentTypes['HealthReady']> = {
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IdentityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Identity'] = ResolversParentTypes['Identity']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recoveryAddresses?: Resolver<Maybe<Array<Maybe<ResolversTypes['RecoveryAddress']>>>, ParentType, ContextType>;
  schemaId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schemaUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  traits?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  verifiableAddresses?: Resolver<Maybe<Array<Maybe<ResolversTypes['VerifiableAddress']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type LoginFlowResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginFlow'] = ResolversParentTypes['LoginFlow']> = {
  active?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  forced?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  issuedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ui?: Resolver<ResolversTypes['UiContainer'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginViaApiResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginViaApiResponse'] = ResolversParentTypes['LoginViaApiResponse']> = {
  session?: Resolver<ResolversTypes['Session'], ParentType, ContextType>;
  sessionToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  completeSelfServiceLoginFlowWithPasswordMethod?: Resolver<Maybe<ResolversTypes['LoginViaApiResponse']>, ParentType, ContextType, RequireFields<MutationCompleteSelfServiceLoginFlowWithPasswordMethodArgs, 'flow'>>;
  completeSelfServiceRegistrationFlowWithPasswordMethod?: Resolver<Maybe<ResolversTypes['RegistrationViaApiResponse']>, ParentType, ContextType, Partial<MutationCompleteSelfServiceRegistrationFlowWithPasswordMethodArgs>>;
  createIdentity?: Resolver<Maybe<ResolversTypes['Identity']>, ParentType, ContextType, Partial<MutationCreateIdentityArgs>>;
  createRecoveryLink?: Resolver<Maybe<ResolversTypes['RecoveryLink']>, ParentType, ContextType, Partial<MutationCreateRecoveryLinkArgs>>;
  mutationViewerAnyAuth?: Resolver<Maybe<ResolversTypes['MutationViewerAnyAuth']>, ParentType, ContextType, Partial<MutationMutationViewerAnyAuthArgs>>;
  mutationViewerApiKey?: Resolver<Maybe<ResolversTypes['MutationViewerApiKey']>, ParentType, ContextType, RequireFields<MutationMutationViewerApiKeyArgs, 'apiKey'>>;
  ping?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updateIdentity?: Resolver<Maybe<ResolversTypes['Identity']>, ParentType, ContextType, RequireFields<MutationUpdateIdentityArgs, 'id'>>;
};

export type MutationViewerAnyAuthResolvers<ContextType = any, ParentType extends ResolversParentTypes['MutationViewerAnyAuth'] = ResolversParentTypes['MutationViewerAnyAuth']> = {
  completeSelfServiceSettingsFlowWithPasswordMethod?: Resolver<Maybe<ResolversTypes['SettingsViaApiResponse']>, ParentType, ContextType, Partial<MutationViewerAnyAuthCompleteSelfServiceSettingsFlowWithPasswordMethodArgs>>;
  completeSelfServiceSettingsFlowWithProfileMethod?: Resolver<Maybe<ResolversTypes['SettingsFlow']>, ParentType, ContextType, Partial<MutationViewerAnyAuthCompleteSelfServiceSettingsFlowWithProfileMethodArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationViewerApiKeyResolvers<ContextType = any, ParentType extends ResolversParentTypes['MutationViewerApiKey'] = ResolversParentTypes['MutationViewerApiKey']> = {
  completeSelfServiceSettingsFlowWithPasswordMethod?: Resolver<Maybe<ResolversTypes['SettingsViaApiResponse']>, ParentType, ContextType, Partial<MutationViewerApiKeyCompleteSelfServiceSettingsFlowWithPasswordMethodArgs>>;
  completeSelfServiceSettingsFlowWithProfileMethod?: Resolver<Maybe<ResolversTypes['SettingsFlow']>, ParentType, ContextType, Partial<MutationViewerApiKeyCompleteSelfServiceSettingsFlowWithProfileMethodArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  errorContainer?: Resolver<Maybe<ResolversTypes['ErrorContainer']>, ParentType, ContextType, RequireFields<QueryErrorContainerArgs, 'error'>>;
  getSelfServiceLoginFlow?: Resolver<Maybe<ResolversTypes['LoginFlow']>, ParentType, ContextType, RequireFields<QueryGetSelfServiceLoginFlowArgs, 'id'>>;
  getSelfServiceRecoveryFlow?: Resolver<Maybe<ResolversTypes['RecoveryFlow']>, ParentType, ContextType, RequireFields<QueryGetSelfServiceRecoveryFlowArgs, 'id'>>;
  getSelfServiceRegistrationFlow?: Resolver<Maybe<ResolversTypes['RegistrationFlow']>, ParentType, ContextType, RequireFields<QueryGetSelfServiceRegistrationFlowArgs, 'id'>>;
  getSelfServiceVerificationFlow?: Resolver<Maybe<ResolversTypes['VerificationFlow']>, ParentType, ContextType, RequireFields<QueryGetSelfServiceVerificationFlowArgs, 'id'>>;
  healthAlive?: Resolver<Maybe<ResolversTypes['HealthAlive']>, ParentType, ContextType>;
  healthReady?: Resolver<Maybe<ResolversTypes['HealthReady']>, ParentType, ContextType>;
  identities?: Resolver<Maybe<Array<Maybe<ResolversTypes['Identity']>>>, ParentType, ContextType, Partial<QueryIdentitiesArgs>>;
  identity?: Resolver<Maybe<ResolversTypes['Identity']>, ParentType, ContextType, RequireFields<QueryIdentityArgs, 'id'>>;
  jsonSchema?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<QueryJsonSchemaArgs, 'id'>>;
  loginFlow?: Resolver<Maybe<ResolversTypes['LoginFlow']>, ParentType, ContextType, Partial<QueryLoginFlowArgs>>;
  ping?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recoveryFlow?: Resolver<Maybe<ResolversTypes['RecoveryFlow']>, ParentType, ContextType>;
  registrationFlow?: Resolver<Maybe<ResolversTypes['RegistrationFlow']>, ParentType, ContextType>;
  verificationFlow?: Resolver<Maybe<ResolversTypes['VerificationFlow']>, ParentType, ContextType>;
  version?: Resolver<Maybe<ResolversTypes['Version']>, ParentType, ContextType>;
  viewerAnyAuth?: Resolver<Maybe<ResolversTypes['ViewerAnyAuth']>, ParentType, ContextType, Partial<QueryViewerAnyAuthArgs>>;
  viewerApiKey?: Resolver<Maybe<ResolversTypes['ViewerApiKey']>, ParentType, ContextType, RequireFields<QueryViewerApiKeyArgs, 'apiKey'>>;
};

export type RecoveryAddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecoveryAddress'] = ResolversParentTypes['RecoveryAddress']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  via?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecoveryFlowResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecoveryFlow'] = ResolversParentTypes['RecoveryFlow']> = {
  active?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  issuedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<Maybe<ResolversTypes['UiText']>>>, ParentType, ContextType>;
  methods?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  requestUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecoveryLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecoveryLink'] = ResolversParentTypes['RecoveryLink']> = {
  expiresAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  recoveryLink?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegistrationFlowResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegistrationFlow'] = ResolversParentTypes['RegistrationFlow']> = {
  active?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  issuedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<Maybe<ResolversTypes['UiText']>>>, ParentType, ContextType>;
  methods?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  requestUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RegistrationViaApiResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['RegistrationViaApiResponse'] = ResolversParentTypes['RegistrationViaApiResponse']> = {
  identity?: Resolver<ResolversTypes['Identity'], ParentType, ContextType>;
  session?: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType>;
  sessionToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SessionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Session'] = ResolversParentTypes['Session']> = {
  active?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  authenticatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  identity?: Resolver<ResolversTypes['Identity'], ParentType, ContextType>;
  issuedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SettingsFlowResolvers<ContextType = any, ParentType extends ResolversParentTypes['SettingsFlow'] = ResolversParentTypes['SettingsFlow']> = {
  active?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiresAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  identity?: Resolver<ResolversTypes['Identity'], ParentType, ContextType>;
  issuedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<Maybe<ResolversTypes['UiText']>>>, ParentType, ContextType>;
  methods?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  requestUrl?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SettingsViaApiResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SettingsViaApiResponse'] = ResolversParentTypes['SettingsViaApiResponse']> = {
  flow?: Resolver<ResolversTypes['SettingsFlow'], ParentType, ContextType>;
  identity?: Resolver<ResolversTypes['Identity'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiContainerResolvers<ContextType = any, ParentType extends ResolversParentTypes['UiContainer'] = ResolversParentTypes['UiContainer']> = {
  action?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<Maybe<ResolversTypes['UiText']>>>, ParentType, ContextType>;
  method?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nodes?: Resolver<Array<Maybe<ResolversTypes['UiNode']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiNodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['UiNode'] = ResolversParentTypes['UiNode']> = {
  attributes?: Resolver<ResolversTypes['UiNodeAttributes'], ParentType, ContextType>;
  group?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  messages?: Resolver<Array<Maybe<ResolversTypes['UiText']>>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiNodeAnchorAttributesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UiNodeAnchorAttributes'] = ResolversParentTypes['UiNodeAnchorAttributes']> = {
  href?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['UiText'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiNodeAttributesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UiNodeAttributes'] = ResolversParentTypes['UiNodeAttributes']> = {
  __resolveType: TypeResolveFn<'UiNodeAnchorAttributes' | 'UiNodeImageAttributes' | 'UiNodeInputAttributes' | 'UiNodeTextAttributes', ParentType, ContextType>;
};

export type UiNodeImageAttributesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UiNodeImageAttributes'] = ResolversParentTypes['UiNodeImageAttributes']> = {
  src?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiNodeInputAttributesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UiNodeInputAttributes'] = ResolversParentTypes['UiNodeInputAttributes']> = {
  disabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  label?: Resolver<Maybe<ResolversTypes['UiText']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pattern?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  required?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiNodeTextAttributesResolvers<ContextType = any, ParentType extends ResolversParentTypes['UiNodeTextAttributes'] = ResolversParentTypes['UiNodeTextAttributes']> = {
  text?: Resolver<ResolversTypes['UiText'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UiTextResolvers<ContextType = any, ParentType extends ResolversParentTypes['UiText'] = ResolversParentTypes['UiText']> = {
  context?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerifiableAddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerifiableAddress'] = ResolversParentTypes['VerifiableAddress']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  verifiedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  via?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerificationFlowResolvers<ContextType = any, ParentType extends ResolversParentTypes['VerificationFlow'] = ResolversParentTypes['VerificationFlow']> = {
  active?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expiresAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  issuedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<Maybe<ResolversTypes['UiText']>>>, ParentType, ContextType>;
  methods?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
  requestUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VersionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Version'] = ResolversParentTypes['Version']> = {
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ViewerAnyAuthResolvers<ContextType = any, ParentType extends ResolversParentTypes['ViewerAnyAuth'] = ResolversParentTypes['ViewerAnyAuth']> = {
  getSelfServiceSettingsFlow?: Resolver<Maybe<ResolversTypes['SettingsFlow']>, ParentType, ContextType, RequireFields<ViewerAnyAuthGetSelfServiceSettingsFlowArgs, 'id'>>;
  session?: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType, Partial<ViewerAnyAuthSessionArgs>>;
  settingsFlow?: Resolver<Maybe<ResolversTypes['SettingsFlow']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ViewerApiKeyResolvers<ContextType = any, ParentType extends ResolversParentTypes['ViewerApiKey'] = ResolversParentTypes['ViewerApiKey']> = {
  getSelfServiceSettingsFlow?: Resolver<Maybe<ResolversTypes['SettingsFlow']>, ParentType, ContextType, RequireFields<ViewerApiKeyGetSelfServiceSettingsFlowArgs, 'id'>>;
  session?: Resolver<Maybe<ResolversTypes['Session']>, ParentType, ContextType, Partial<ViewerApiKeySessionArgs>>;
  settingsFlow?: Resolver<Maybe<ResolversTypes['SettingsFlow']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BigInt?: GraphQLScalarType;
  ErrorContainer?: ErrorContainerResolvers<ContextType>;
  HealthAlive?: HealthAliveResolvers<ContextType>;
  HealthReady?: HealthReadyResolvers<ContextType>;
  Identity?: IdentityResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  LoginFlow?: LoginFlowResolvers<ContextType>;
  LoginViaApiResponse?: LoginViaApiResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationViewerAnyAuth?: MutationViewerAnyAuthResolvers<ContextType>;
  MutationViewerApiKey?: MutationViewerApiKeyResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RecoveryAddress?: RecoveryAddressResolvers<ContextType>;
  RecoveryFlow?: RecoveryFlowResolvers<ContextType>;
  RecoveryLink?: RecoveryLinkResolvers<ContextType>;
  RegistrationFlow?: RegistrationFlowResolvers<ContextType>;
  RegistrationViaApiResponse?: RegistrationViaApiResponseResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  SettingsFlow?: SettingsFlowResolvers<ContextType>;
  SettingsViaApiResponse?: SettingsViaApiResponseResolvers<ContextType>;
  UiContainer?: UiContainerResolvers<ContextType>;
  UiNode?: UiNodeResolvers<ContextType>;
  UiNodeAnchorAttributes?: UiNodeAnchorAttributesResolvers<ContextType>;
  UiNodeAttributes?: UiNodeAttributesResolvers<ContextType>;
  UiNodeImageAttributes?: UiNodeImageAttributesResolvers<ContextType>;
  UiNodeInputAttributes?: UiNodeInputAttributesResolvers<ContextType>;
  UiNodeTextAttributes?: UiNodeTextAttributesResolvers<ContextType>;
  UiText?: UiTextResolvers<ContextType>;
  VerifiableAddress?: VerifiableAddressResolvers<ContextType>;
  VerificationFlow?: VerificationFlowResolvers<ContextType>;
  Version?: VersionResolvers<ContextType>;
  ViewerAnyAuth?: ViewerAnyAuthResolvers<ContextType>;
  ViewerApiKey?: ViewerApiKeyResolvers<ContextType>;
};


/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {|
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: any,
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any,
|};


export type CompleteSelfServiceLoginFlowWithPasswordMethodInput = {|
  /** Sending the anti-csrf token is only required for browser login flows. */
  csrfToken?: ?$ElementType<Scalars, 'String'>,
  /** Identifier is the email or username of the user trying to log in. */
  identifier?: ?$ElementType<Scalars, 'String'>,
  /** The user's password. */
  password?: ?$ElementType<Scalars, 'String'>,
|};

export type CompleteSelfServiceSettingsFlowWithPasswordMethodInput = {|
  /**
   * CSRFToken is the anti-CSRF token
   *
   * type: string
   */
  csrfToken?: ?$ElementType<Scalars, 'String'>,
  /**
   * Password is the updated password
   *
   * type: string
   */
  password: $ElementType<Scalars, 'String'>,
|};

export type CreateIdentityInput = {|
  /** SchemaID is the ID of the JSON Schema to be used for validating the identity's traits. */
  schemaId: $ElementType<Scalars, 'String'>,
  /**
   * Traits represent an identity's traits. The identity is able to create, modify, and delete traits
   * in a self-service manner. The input will always be validated against the JSON Schema defined
   * in `schema_url`.
   */
  traits: $ElementType<Scalars, 'JSON'>,
|};

export type CreateRecoveryLinkInput = {|
  /**
   * Link Expires In
   *
   * The recovery link will expire at that point in time. Defaults to the configuration value of
   * `selfservice.flows.recovery.request_lifespan`.
   */
  expiresIn?: ?$ElementType<Scalars, 'String'>,
  identityId: $ElementType<Scalars, 'String'>,
|};

export type ErrorContainer = {|
  __typename?: 'ErrorContainer',
  /** Errors in the container */
  errors: Array<?$ElementType<Scalars, 'JSON'>>,
  id: $ElementType<Scalars, 'String'>,
|};

export type HealthAlive = {|
  __typename?: 'HealthAlive',
  /** Always "ok". */
  status: $ElementType<Scalars, 'String'>,
|};

export type HealthReady = {|
  __typename?: 'HealthReady',
  /** Always "ok". */
  status: $ElementType<Scalars, 'String'>,
|};

export type Identity = {|
  __typename?: 'Identity',
  id: $ElementType<Scalars, 'String'>,
  /** RecoveryAddresses contains all the addresses that can be used to recover an identity. */
  recoveryAddresses?: ?Array<?RecoveryAddress>,
  /** SchemaID is the ID of the JSON Schema to be used for validating the identity's traits. */
  schemaId: $ElementType<Scalars, 'String'>,
  /**
   * SchemaURL is the URL of the endpoint where the identity's traits schema can be fetched from.
   *
   * format: url
   */
  schemaUrl: $ElementType<Scalars, 'String'>,
  traits: $ElementType<Scalars, 'JSON'>,
  /** VerifiableAddresses contains all the addresses that can be verified by the user. */
  verifiableAddresses?: ?Array<?VerifiableAddress>,
|};


/**
 * This object represents a login flow. A login flow is initiated at the "Initiate Login API / Browser Flow"
 * endpoint by a client.
 *
 * Once a login flow is completed successfully, a session cookie or session token will be issued.
 */
export type LoginFlow = {|
  __typename?: 'LoginFlow',
  /** and so on. */
  active?: ?$ElementType<Scalars, 'String'>,
  /**
   * ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to log in,
   * a new flow has to be initiated.
   */
  expiresAt: $ElementType<Scalars, 'String'>,
  /** Forced stores whether this login flow should enforce re-authentication. */
  forced?: ?$ElementType<Scalars, 'Boolean'>,
  id: $ElementType<Scalars, 'String'>,
  /** IssuedAt is the time (UTC) when the flow started. */
  issuedAt: $ElementType<Scalars, 'String'>,
  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used
   * to forward information contained in the URL's path or query for example.
   */
  requestUrl: $ElementType<Scalars, 'String'>,
  /** The flow type can either be `api` or `browser`. */
  type: $ElementType<Scalars, 'String'>,
  /** Container represents a HTML Form. The container can work with both HTTP Form and JSON requests */
  ui: UiContainer,
|};

/** The Response for Login Flows via API */
export type LoginViaApiResponse = {|
  __typename?: 'LoginViaApiResponse',
  session: Session,
  /**
   * The Session Token
   *
   * A session token is equivalent to a session cookie, but it can be sent in the HTTP Authorization
   * Header:
   *
   * Authorization: bearer ${session-token}
   *
   * The session token is only issued for API flows, not for Browser flows!
   */
  sessionToken: $ElementType<Scalars, 'String'>,
|};

/** Root Mutation */
export type Mutation = {|
  __typename?: 'Mutation',
  /**
   * Use this endpoint to complete a login flow by sending an identity's identifier and password. This endpoint
   * behaves differently for API and browser flows.
   *
   * API flows expect `application/json` to be sent in the body and responds with
   * HTTP 200 and a application/json body with the session token on success;
   * HTTP 302 redirect to a fresh login flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after login URL or the `return_to` value if it was set and if the login succeeded;
   * a HTTP 302 redirect to the login UI URL with the flow ID containing the validation errors otherwise.
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API POST /self-service/login/methods/password
   */
  completeSelfServiceLoginFlowWithPasswordMethod?: ?LoginViaApiResponse,
  /**
   * Use this endpoint to complete a registration flow by sending an identity's traits and password. This endpoint
   * behaves differently for API and browser flows.
   *
   * API flows expect `application/json` to be sent in the body and respond with
   * HTTP 200 and a application/json body with the created identity success - if the session hook is configured the
   * `session` and `session_token` will also be included;
   * HTTP 302 redirect to a fresh registration flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after registration URL or the `return_to` value if it was set and if the registration succeeded;
   * a HTTP 302 redirect to the registration UI URL with the flow ID containing the validation errors otherwise.
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API POST /self-service/registration/methods/password
   */
  completeSelfServiceRegistrationFlowWithPasswordMethod?: ?RegistrationViaApiResponse,
  /**
   * This endpoint creates an identity. It is NOT possible to set an identity's credentials (password, ...)
   * using this method! A way to achieve that will be introduced in the future.
   *
   * Learn how identities work in [Ory Kratos' User And Identity Model Documentation](https://www.ory.sh/docs/next/kratos/concepts/identity-user-model).
   *
   * Equivalent to Ory Kratos API POST /identities
   */
  createIdentity?: ?Identity,
  /**
   * This endpoint creates a recovery link which should be given to the user in order for them to recover
   * (or activate) their account.
   *
   * Equivalent to Ory Kratos API POST /recovery/link
   */
  createRecoveryLink?: ?RecoveryLink,
  /** A viewer that wraps operations for all available authentication mechanisms */
  mutationViewerAnyAuth?: ?MutationViewerAnyAuth,
  /** , in OAS 'Ory Kratos API */
  mutationViewerApiKey?: ?MutationViewerApiKey,
  ping?: ?$ElementType<Scalars, 'String'>,
  /**
   * This endpoint updates an identity. It is NOT possible to set an identity's credentials (password, ...)
   * using this method! A way to achieve that will be introduced in the future.
   *
   * The full identity payload (except credentials) is expected. This endpoint does not support patching.
   *
   * Learn how identities work in [Ory Kratos' User And Identity Model Documentation](https://www.ory.sh/docs/next/kratos/concepts/identity-user-model).
   *
   * Equivalent to Ory Kratos API PUT /identities/{id}
   */
  updateIdentity?: ?Identity,
|};


/** Root Mutation */
export type MutationCompleteSelfServiceLoginFlowWithPasswordMethodArgs = {|
  completeSelfServiceLoginFlowWithPasswordMethodInput?: ?CompleteSelfServiceLoginFlowWithPasswordMethodInput,
  flow: $ElementType<Scalars, 'String'>,
|};


/** Root Mutation */
export type MutationCompleteSelfServiceRegistrationFlowWithPasswordMethodArgs = {|
  flow?: ?$ElementType<Scalars, 'String'>,
  selfServiceRegistrationMethodsPasswordInput?: ?$ElementType<Scalars, 'JSON'>,
|};


/** Root Mutation */
export type MutationCreateIdentityArgs = {|
  createIdentityInput?: ?CreateIdentityInput,
|};


/** Root Mutation */
export type MutationCreateRecoveryLinkArgs = {|
  createRecoveryLinkInput?: ?CreateRecoveryLinkInput,
|};


/** Root Mutation */
export type MutationMutationViewerAnyAuthArgs = {|
  sessionCookie?: ?SessionCookieInput,
  sessionToken?: ?SessionTokenInput,
|};


/** Root Mutation */
export type MutationMutationViewerApiKeyArgs = {|
  apiKey: $ElementType<Scalars, 'String'>,
|};


/** Root Mutation */
export type MutationUpdateIdentityArgs = {|
  id: $ElementType<Scalars, 'String'>,
  updateIdentityInput?: ?UpdateIdentityInput,
|};

/** Warning: Not every request will work with this viewer type */
export type MutationViewerAnyAuth = {|
  __typename?: 'MutationViewerAnyAuth',
  /**
   * Use this endpoint to complete a settings flow by sending an identity's updated password. This endpoint
   * behaves differently for API and browser flows.
   *
   * API-initiated flows expect `application/json` to be sent in the body and respond with
   * HTTP 200 and an application/json body with the session token on success;
   * HTTP 302 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   * HTTP 401 when the endpoint is called without a valid session token.
   * HTTP 403 when `selfservice.flows.settings.privileged_session_max_age` was reached.
   * Implies that the user needs to re-authenticate.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after settings URL or the `return_to` value if it was set and if the flow succeeded;
   * a HTTP 302 redirect to the Settings UI URL with the flow ID containing the validation errors otherwise.
   * a HTTP 302 redirect to the login endpoint when `selfservice.flows.settings.privileged_session_max_age` was reached.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API POST /self-service/settings/methods/password
   */
  completeSelfServiceSettingsFlowWithPasswordMethod?: ?SettingsViaApiResponse,
  /**
   * Use this endpoint to complete a settings flow by sending an identity's updated traits. This endpoint
   * behaves differently for API and browser flows.
   *
   * API-initiated flows expect `application/json` to be sent in the body and respond with
   * HTTP 200 and an application/json body with the session token on success;
   * HTTP 302 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   * HTTP 401 when the endpoint is called without a valid session token.
   * HTTP 403 when `selfservice.flows.settings.privileged_session_max_age` was reached and a sensitive field was
   * updated (e.g. recovery email). Implies that the user needs to re-authenticate.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after settings URL or the `return_to` value if it was set and if the flow succeeded;
   * a HTTP 302 redirect to the settings UI URL with the flow ID containing the validation errors otherwise.
   * a HTTP 302 redirect to the login endpoint when `selfservice.flows.settings.privileged_session_max_age` was reached.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API POST /self-service/settings/methods/profile
   */
  completeSelfServiceSettingsFlowWithProfileMethod?: ?SettingsFlow,
|};


/** Warning: Not every request will work with this viewer type */
export type MutationViewerAnyAuthCompleteSelfServiceSettingsFlowWithPasswordMethodArgs = {|
  completeSelfServiceSettingsFlowWithPasswordMethodInput?: ?CompleteSelfServiceSettingsFlowWithPasswordMethodInput,
  flow?: ?$ElementType<Scalars, 'String'>,
|};


/** Warning: Not every request will work with this viewer type */
export type MutationViewerAnyAuthCompleteSelfServiceSettingsFlowWithProfileMethodArgs = {|
  flow?: ?$ElementType<Scalars, 'String'>,
  selfServiceSettingsMethodsProfileInput?: ?$ElementType<Scalars, 'JSON'>,
|};

/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type MutationViewerApiKey = {|
  __typename?: 'MutationViewerApiKey',
  /**
   * Use this endpoint to complete a settings flow by sending an identity's updated password. This endpoint
   * behaves differently for API and browser flows.
   *
   * API-initiated flows expect `application/json` to be sent in the body and respond with
   * HTTP 200 and an application/json body with the session token on success;
   * HTTP 302 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   * HTTP 401 when the endpoint is called without a valid session token.
   * HTTP 403 when `selfservice.flows.settings.privileged_session_max_age` was reached.
   * Implies that the user needs to re-authenticate.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after settings URL or the `return_to` value if it was set and if the flow succeeded;
   * a HTTP 302 redirect to the Settings UI URL with the flow ID containing the validation errors otherwise.
   * a HTTP 302 redirect to the login endpoint when `selfservice.flows.settings.privileged_session_max_age` was reached.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API POST /self-service/settings/methods/password
   */
  completeSelfServiceSettingsFlowWithPasswordMethod?: ?SettingsViaApiResponse,
  /**
   * Use this endpoint to complete a settings flow by sending an identity's updated traits. This endpoint
   * behaves differently for API and browser flows.
   *
   * API-initiated flows expect `application/json` to be sent in the body and respond with
   * HTTP 200 and an application/json body with the session token on success;
   * HTTP 302 redirect to a fresh settings flow if the original flow expired with the appropriate error messages set;
   * HTTP 400 on form validation errors.
   * HTTP 401 when the endpoint is called without a valid session token.
   * HTTP 403 when `selfservice.flows.settings.privileged_session_max_age` was reached and a sensitive field was
   * updated (e.g. recovery email). Implies that the user needs to re-authenticate.
   *
   * Browser flows expect `application/x-www-form-urlencoded` to be sent in the body and responds with
   * a HTTP 302 redirect to the post/after settings URL or the `return_to` value if it was set and if the flow succeeded;
   * a HTTP 302 redirect to the settings UI URL with the flow ID containing the validation errors otherwise.
   * a HTTP 302 redirect to the login endpoint when `selfservice.flows.settings.privileged_session_max_age` was reached.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API POST /self-service/settings/methods/profile
   */
  completeSelfServiceSettingsFlowWithProfileMethod?: ?SettingsFlow,
|};


/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type MutationViewerApiKeyCompleteSelfServiceSettingsFlowWithPasswordMethodArgs = {|
  completeSelfServiceSettingsFlowWithPasswordMethodInput?: ?CompleteSelfServiceSettingsFlowWithPasswordMethodInput,
  flow?: ?$ElementType<Scalars, 'String'>,
|};


/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type MutationViewerApiKeyCompleteSelfServiceSettingsFlowWithProfileMethodArgs = {|
  flow?: ?$ElementType<Scalars, 'String'>,
  selfServiceSettingsMethodsProfileInput?: ?$ElementType<Scalars, 'JSON'>,
|};

/** Root Query */
export type Query = {|
  __typename?: 'Query',
  /**
   * This endpoint returns the error associated with a user-facing self service errors.
   *
   * This endpoint supports stub values to help you implement the error UI:
   *
   * `?error=stub:500` - returns a stub 500 (Internal Server Error) error.
   *
   * More information can be found at [Ory Kratos User User Facing Error Documentation](https://www.ory.sh/docs/kratos/self-service/flows/user-facing-errors).
   *
   * Equivalent to Ory Kratos API GET /self-service/errors
   */
  errorContainer?: ?ErrorContainer,
  /**
   * This endpoint returns a login flow's context with, for example, error details and other information.
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API GET /self-service/login/flows
   */
  getSelfServiceLoginFlow?: ?LoginFlow,
  /**
   * This endpoint returns a recovery flow's context with, for example, error details and other information.
   *
   * More information can be found at [Ory Kratos Account Recovery Documentation](../self-service/flows/account-recovery.mdx).
   *
   * Equivalent to Ory Kratos API GET /self-service/recovery/flows
   */
  getSelfServiceRecoveryFlow?: ?RecoveryFlow,
  /**
   * This endpoint returns a registration flow's context with, for example, error details and other information.
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API GET /self-service/registration/flows
   */
  getSelfServiceRegistrationFlow?: ?RegistrationFlow,
  /**
   * This endpoint returns a verification flow's context with, for example, error details and other information.
   *
   * More information can be found at [Ory Kratos Email and Phone Verification Documentation](https://www.ory.sh/docs/kratos/selfservice/flows/verify-email-account-activation).
   *
   * Equivalent to Ory Kratos API GET /self-service/verification/flows
   */
  getSelfServiceVerificationFlow?: ?VerificationFlow,
  /**
   * This endpoint returns a HTTP 200 status code when Ory Kratos is accepting incoming
   * HTTP requests. This status does currently not include checks whether the database connection is working.
   *
   * If the service supports TLS Edge Termination, this endpoint does not require the
   * `X-Forwarded-Proto` header to be set.
   *
   * Be aware that if you are running multiple nodes of this service, the health status will never
   * refer to the cluster state, only to a single instance.
   *
   * Equivalent to Ory Kratos API GET /health/alive
   */
  healthAlive?: ?HealthAlive,
  /**
   * This endpoint returns a HTTP 200 status code when Ory Kratos is up running and the environment dependencies (e.g.
   * the database) are responsive as well.
   *
   * If the service supports TLS Edge Termination, this endpoint does not require the
   * `X-Forwarded-Proto` header to be set.
   *
   * Be aware that if you are running multiple nodes of Ory Kratos, the health status will never
   * refer to the cluster state, only to a single instance.
   *
   * Equivalent to Ory Kratos API GET /health/ready
   */
  healthReady?: ?HealthReady,
  /**
   * Lists all identities. Does not support search at the moment.
   *
   * Learn how identities work in [Ory Kratos' User And Identity Model Documentation](https://www.ory.sh/docs/next/kratos/concepts/identity-user-model).
   *
   * Equivalent to Ory Kratos API GET /identities
   */
  identities?: ?Array<?Identity>,
  /**
   * Learn how identities work in [Ory Kratos' User And Identity Model Documentation](https://www.ory.sh/docs/next/kratos/concepts/identity-user-model).
   *
   * Equivalent to Ory Kratos API GET /identities/{id}
   */
  identity?: ?Identity,
  /**
   * Get a Traits Schema Definition
   *
   * Equivalent to Ory Kratos API GET /schemas/{id}
   */
  jsonSchema?: ?$ElementType<Scalars, 'JSON'>,
  /**
   * This endpoint initiates a login flow for API clients such as mobile devices, smart TVs, and so on.
   *
   * If a valid provided session cookie or session token is provided, a 400 Bad Request error
   * will be returned unless the URL query parameter `?refresh=true` is set.
   *
   * To fetch an existing login flow call `/self-service/login/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks, including CSRF login attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API GET /self-service/login/api
   */
  loginFlow?: ?LoginFlow,
  ping?: ?$ElementType<Scalars, 'String'>,
  /**
   * This endpoint initiates a recovery flow for API clients such as mobile devices, smart TVs, and so on.
   *
   * If a valid provided session cookie or session token is provided, a 400 Bad Request error.
   *
   * To fetch an existing recovery flow call `/self-service/recovery/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos Account Recovery Documentation](../self-service/flows/account-recovery.mdx).
   *
   * Equivalent to Ory Kratos API GET /self-service/recovery/api
   */
  recoveryFlow?: ?RecoveryFlow,
  /**
   * This endpoint initiates a registration flow for API clients such as mobile devices, smart TVs, and so on.
   *
   * If a valid provided session cookie or session token is provided, a 400 Bad Request error
   * will be returned unless the URL query parameter `?refresh=true` is set.
   *
   * To fetch an existing registration flow call `/self-service/registration/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos User Login and User Registration Documentation](https://www.ory.sh/docs/next/kratos/self-service/flows/user-login-user-registration).
   *
   * Equivalent to Ory Kratos API GET /self-service/registration/api
   */
  registrationFlow?: ?RegistrationFlow,
  /**
   * This endpoint initiates a verification flow for API clients such as mobile devices, smart TVs, and so on.
   *
   * To fetch an existing verification flow call `/self-service/verification/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos Email and Phone Verification Documentation](https://www.ory.sh/docs/kratos/selfservice/flows/verify-email-account-activation).
   *
   * Equivalent to Ory Kratos API GET /self-service/verification/api
   */
  verificationFlow?: ?VerificationFlow,
  /**
   * This endpoint returns the version of Ory Kratos.
   *
   * If the service supports TLS Edge Termination, this endpoint does not require the
   * `X-Forwarded-Proto` header to be set.
   *
   * Be aware that if you are running multiple nodes of this service, the version will never
   * refer to the cluster state, only to a single instance.
   *
   * Equivalent to Ory Kratos API GET /version
   */
  version?: ?Version,
  /** A viewer that wraps operations for all available authentication mechanisms */
  viewerAnyAuth?: ?ViewerAnyAuth,
  /** , in OAS 'Ory Kratos API */
  viewerApiKey?: ?ViewerApiKey,
|};


/** Root Query */
export type QueryErrorContainerArgs = {|
  error: $ElementType<Scalars, 'String'>,
|};


/** Root Query */
export type QueryGetSelfServiceLoginFlowArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


/** Root Query */
export type QueryGetSelfServiceRecoveryFlowArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


/** Root Query */
export type QueryGetSelfServiceRegistrationFlowArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


/** Root Query */
export type QueryGetSelfServiceVerificationFlowArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


/** Root Query */
export type QueryIdentitiesArgs = {|
  page?: ?$ElementType<Scalars, 'BigInt'>,
  perPage?: ?$ElementType<Scalars, 'BigInt'>,
|};


/** Root Query */
export type QueryIdentityArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


/** Root Query */
export type QueryJsonSchemaArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


/** Root Query */
export type QueryLoginFlowArgs = {|
  refresh?: ?$ElementType<Scalars, 'Boolean'>,
|};


/** Root Query */
export type QueryViewerAnyAuthArgs = {|
  sessionCookie?: ?SessionCookieInput,
  sessionToken?: ?SessionTokenInput,
|};


/** Root Query */
export type QueryViewerApiKeyArgs = {|
  apiKey: $ElementType<Scalars, 'String'>,
|};

export type RecoveryAddress = {|
  __typename?: 'RecoveryAddress',
  id: $ElementType<Scalars, 'String'>,
  value: $ElementType<Scalars, 'String'>,
  via: $ElementType<Scalars, 'String'>,
|};

/**
 * This request is used when an identity wants to recover their account.
 *
 * We recommend reading the [Account Recovery Documentation](../self-service/flows/password-reset-account-recovery)
 */
export type RecoveryFlow = {|
  __typename?: 'RecoveryFlow',
  /**
   * Active, if set, contains the registration method that is being used. It is initially
   * not set.
   */
  active?: ?$ElementType<Scalars, 'String'>,
  /**
   * ExpiresAt is the time (UTC) when the request expires. If the user still wishes to update the setting,
   * a new request has to be initiated.
   */
  expiresAt: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
  /** IssuedAt is the time (UTC) when the request occurred. */
  issuedAt: $ElementType<Scalars, 'String'>,
  messages?: ?Array<?UiText>,
  /**
   * Methods contains context for all account recovery methods. If a registration request has been
   * processed, but for example the password is incorrect, this will contain error messages.
   */
  methods: $ElementType<Scalars, 'JSON'>,
  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used
   * to forward information contained in the URL's path or query for example.
   */
  requestUrl: $ElementType<Scalars, 'String'>,
  state: $ElementType<Scalars, 'String'>,
  /** The flow type can either be `api` or `browser`. */
  type?: ?$ElementType<Scalars, 'String'>,
|};

export type RecoveryLink = {|
  __typename?: 'RecoveryLink',
  /**
   * Recovery Link Expires At
   *
   * The timestamp when the recovery link expires.
   */
  expiresAt?: ?$ElementType<Scalars, 'String'>,
  /**
   * Recovery Link
   *
   * This link can be used to recover the account.
   */
  recoveryLink: $ElementType<Scalars, 'String'>,
|};

export type RegistrationFlow = {|
  __typename?: 'RegistrationFlow',
  /** and so on. */
  active?: ?$ElementType<Scalars, 'String'>,
  /**
   * ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to log in,
   * a new flow has to be initiated.
   */
  expiresAt: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
  /** IssuedAt is the time (UTC) when the flow occurred. */
  issuedAt: $ElementType<Scalars, 'String'>,
  messages?: ?Array<?UiText>,
  /**
   * Methods contains context for all enabled registration methods. If a registration flow has been
   * processed, but for example the password is incorrect, this will contain error messages.
   */
  methods: $ElementType<Scalars, 'JSON'>,
  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used
   * to forward information contained in the URL's path or query for example.
   */
  requestUrl: $ElementType<Scalars, 'String'>,
  /** The flow type can either be `api` or `browser`. */
  type?: ?$ElementType<Scalars, 'String'>,
|};

/** The Response for Registration Flows via API */
export type RegistrationViaApiResponse = {|
  __typename?: 'RegistrationViaApiResponse',
  identity: Identity,
  session?: ?Session,
  /**
   * The Session Token
   *
   * This field is only set when the session hook is configured as a post-registration hook.
   *
   * A session token is equivalent to a session cookie, but it can be sent in the HTTP Authorization
   * Header:
   *
   * Authorization: bearer ${session-token}
   *
   * The session token is only issued for API flows, not for Browser flows!
   */
  sessionToken: $ElementType<Scalars, 'String'>,
|};

export type Session = {|
  __typename?: 'Session',
  active?: ?$ElementType<Scalars, 'Boolean'>,
  authenticatedAt: $ElementType<Scalars, 'String'>,
  expiresAt: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
  identity: Identity,
  issuedAt: $ElementType<Scalars, 'String'>,
|};

/** API key credentials for the security protocol 'sessionCookie' in Ory Kratos API */
export type SessionCookieInput = {|
  apiKey?: ?$ElementType<Scalars, 'String'>,
|};

/** API key credentials for the security protocol 'sessionToken' in Ory Kratos API */
export type SessionTokenInput = {|
  apiKey?: ?$ElementType<Scalars, 'String'>,
|};

/**
 * This flow is used when an identity wants to update settings
 * (e.g. profile data, passwords, ...) in a selfservice manner.
 *
 * We recommend reading the [User Settings Documentation](../self-service/flows/user-settings)
 */
export type SettingsFlow = {|
  __typename?: 'SettingsFlow',
  /**
   * Active, if set, contains the registration method that is being used. It is initially
   * not set.
   */
  active?: ?$ElementType<Scalars, 'String'>,
  /**
   * ExpiresAt is the time (UTC) when the flow expires. If the user still wishes to update the setting,
   * a new flow has to be initiated.
   */
  expiresAt: $ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
  identity: Identity,
  /** IssuedAt is the time (UTC) when the flow occurred. */
  issuedAt: $ElementType<Scalars, 'String'>,
  messages?: ?Array<?UiText>,
  /**
   * Methods contains context for all enabled registration methods. If a settings flow has been
   * processed, but for example the first name is empty, this will contain error messages.
   */
  methods: $ElementType<Scalars, 'JSON'>,
  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used
   * to forward information contained in the URL's path or query for example.
   */
  requestUrl: $ElementType<Scalars, 'String'>,
  state: $ElementType<Scalars, 'String'>,
  /** The flow type can either be `api` or `browser`. */
  type?: ?$ElementType<Scalars, 'String'>,
|};

/** The Response for Settings Flows via API */
export type SettingsViaApiResponse = {|
  __typename?: 'SettingsViaApiResponse',
  /**
   * This flow is used when an identity wants to update settings
   * (e.g. profile data, passwords, ...) in a selfservice manner.
   *
   * We recommend reading the [User Settings Documentation](../self-service/flows/user-settings)
   */
  flow: SettingsFlow,
  identity: Identity,
|};

/** Container represents a HTML Form. The container can work with both HTTP Form and JSON requests */
export type UiContainer = {|
  __typename?: 'UiContainer',
  /** Action should be used as the form action URL `<form action="{{ .Action }}" method="post">`. */
  action: $ElementType<Scalars, 'String'>,
  messages?: ?Array<?UiText>,
  /** Method is the form method (e.g. POST) */
  method: $ElementType<Scalars, 'String'>,
  nodes: Array<?UiNode>,
|};

/**
 * Nodes are represented as HTML elements or their native UI equivalents. For example,
 * a node can be an `<img>` tag, or an `<input element>` but also `some plain text`.
 */
export type UiNode = {|
  __typename?: 'UiNode',
  attributes: UiNodeAttributes,
  group: $ElementType<Scalars, 'String'>,
  messages: Array<?UiText>,
  type: $ElementType<Scalars, 'String'>,
|};

export type UiNodeAnchorAttributes = {|
  __typename?: 'UiNodeAnchorAttributes',
  /**
   * The link's href (destination) URL.
   *
   * format: uri
   */
  href: $ElementType<Scalars, 'String'>,
  title: UiText,
|};

/** No description available. */
export type UiNodeAttributes = UiNodeAnchorAttributes | UiNodeImageAttributes | UiNodeInputAttributes | UiNodeTextAttributes;

export type UiNodeImageAttributes = {|
  __typename?: 'UiNodeImageAttributes',
  /**
   * The image's source URL.
   *
   * format: uri
   */
  src: $ElementType<Scalars, 'String'>,
|};

/** InputAttributes represents the attributes of an input node */
export type UiNodeInputAttributes = {|
  __typename?: 'UiNodeInputAttributes',
  /** Sets the input's disabled field to true or false. */
  disabled: $ElementType<Scalars, 'Boolean'>,
  label?: ?UiText,
  /** The input's element name. */
  name: $ElementType<Scalars, 'String'>,
  /** The input's pattern. */
  pattern?: ?$ElementType<Scalars, 'String'>,
  /** Mark this input field as required. */
  required?: ?$ElementType<Scalars, 'Boolean'>,
  type: $ElementType<Scalars, 'String'>,
  value?: ?$ElementType<Scalars, 'JSON'>,
|};

export type UiNodeTextAttributes = {|
  __typename?: 'UiNodeTextAttributes',
  text: UiText,
|};

export type UiText = {|
  __typename?: 'UiText',
  /** The message's context. Useful when customizing messages. */
  context?: ?$ElementType<Scalars, 'JSON'>,
  id: $ElementType<Scalars, 'BigInt'>,
  /** The message text. Written in american english. */
  text: $ElementType<Scalars, 'String'>,
  type: $ElementType<Scalars, 'String'>,
|};

export type UpdateIdentityInput = {|
  /**
   * SchemaID is the ID of the JSON Schema to be used for validating the identity's traits. If set
   * will update the Identity's SchemaID.
   */
  schemaId?: ?$ElementType<Scalars, 'String'>,
  /**
   * Traits represent an identity's traits. The identity is able to create, modify, and delete traits
   * in a self-service manner. The input will always be validated against the JSON Schema defined
   * in `schema_id`.
   */
  traits: $ElementType<Scalars, 'JSON'>,
|};

export type VerifiableAddress = {|
  __typename?: 'VerifiableAddress',
  id: $ElementType<Scalars, 'String'>,
  status: $ElementType<Scalars, 'String'>,
  value: $ElementType<Scalars, 'String'>,
  verified: $ElementType<Scalars, 'Boolean'>,
  verifiedAt?: ?$ElementType<Scalars, 'String'>,
  via: $ElementType<Scalars, 'String'>,
|};

/**
 * Used to verify an out-of-band communication
 * channel such as an email address or a phone number.
 *
 * For more information head over to: https://www.ory.sh/docs/kratos/selfservice/flows/verify-email-account-activation
 */
export type VerificationFlow = {|
  __typename?: 'VerificationFlow',
  /**
   * Active, if set, contains the registration method that is being used. It is initially
   * not set.
   */
  active?: ?$ElementType<Scalars, 'String'>,
  /**
   * ExpiresAt is the time (UTC) when the request expires. If the user still wishes to verify the address,
   * a new request has to be initiated.
   */
  expiresAt?: ?$ElementType<Scalars, 'String'>,
  id: $ElementType<Scalars, 'String'>,
  /** IssuedAt is the time (UTC) when the request occurred. */
  issuedAt?: ?$ElementType<Scalars, 'String'>,
  messages?: ?Array<?UiText>,
  /**
   * Methods contains context for all account verification methods. If a registration request has been
   * processed, but for example the password is incorrect, this will contain error messages.
   */
  methods: $ElementType<Scalars, 'JSON'>,
  /**
   * RequestURL is the initial URL that was requested from Ory Kratos. It can be used
   * to forward information contained in the URL's path or query for example.
   */
  requestUrl?: ?$ElementType<Scalars, 'String'>,
  state: $ElementType<Scalars, 'String'>,
  /** The flow type can either be `api` or `browser`. */
  type: $ElementType<Scalars, 'String'>,
|};

export type Version = {|
  __typename?: 'Version',
  /** The version of Ory Kratos. */
  version: $ElementType<Scalars, 'String'>,
|};

/** Warning: Not every request will work with this viewer type */
export type ViewerAnyAuth = {|
  __typename?: 'ViewerAnyAuth',
  /**
   * When accessing this endpoint through Ory Kratos' Public API you must ensure that either the Ory Kratos Session Cookie
   * or the Ory Kratos Session Token are set. The public endpoint does not return 404 status codes
   * but instead 403 or 500 to improve data privacy.
   *
   * You can access this endpoint without credentials when using Ory Kratos' Admin API.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API GET /self-service/settings/flows
   */
  getSelfServiceSettingsFlow?: ?SettingsFlow,
  /**
   * Uses the HTTP Headers in the GET request to determine (e.g. by using checking the cookies) who is authenticated.
   * Returns a session object in the body or 401 if the credentials are invalid or no credentials were sent.
   * Additionally when the request it successful it adds the user ID to the 'X-Kratos-Authenticated-Identity-Id' header in the response.
   *
   * This endpoint is useful for reverse proxies and API Gateways.
   *
   * Equivalent to Ory Kratos API GET /sessions/whoami
   */
  session?: ?Session,
  /**
   * This endpoint initiates a settings flow for API clients such as mobile devices, smart TVs, and so on.
   * You must provide a valid Ory Kratos Session Token for this endpoint to respond with HTTP 200 OK.
   *
   * To fetch an existing settings flow call `/self-service/settings/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API GET /self-service/settings/api
   */
  settingsFlow?: ?SettingsFlow,
|};


/** Warning: Not every request will work with this viewer type */
export type ViewerAnyAuthGetSelfServiceSettingsFlowArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


/** Warning: Not every request will work with this viewer type */
export type ViewerAnyAuthSessionArgs = {|
  authorization?: ?$ElementType<Scalars, 'String'>,
  cookie?: ?$ElementType<Scalars, 'String'>,
|};

/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type ViewerApiKey = {|
  __typename?: 'ViewerApiKey',
  /**
   * When accessing this endpoint through Ory Kratos' Public API you must ensure that either the Ory Kratos Session Cookie
   * or the Ory Kratos Session Token are set. The public endpoint does not return 404 status codes
   * but instead 403 or 500 to improve data privacy.
   *
   * You can access this endpoint without credentials when using Ory Kratos' Admin API.
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API GET /self-service/settings/flows
   */
  getSelfServiceSettingsFlow?: ?SettingsFlow,
  /**
   * Uses the HTTP Headers in the GET request to determine (e.g. by using checking the cookies) who is authenticated.
   * Returns a session object in the body or 401 if the credentials are invalid or no credentials were sent.
   * Additionally when the request it successful it adds the user ID to the 'X-Kratos-Authenticated-Identity-Id' header in the response.
   *
   * This endpoint is useful for reverse proxies and API Gateways.
   *
   * Equivalent to Ory Kratos API GET /sessions/whoami
   */
  session?: ?Session,
  /**
   * This endpoint initiates a settings flow for API clients such as mobile devices, smart TVs, and so on.
   * You must provide a valid Ory Kratos Session Token for this endpoint to respond with HTTP 200 OK.
   *
   * To fetch an existing settings flow call `/self-service/settings/flows?flow=<flow_id>`.
   *
   * :::warning
   *
   * You MUST NOT use this endpoint in client-side (Single Page Apps, ReactJS, AngularJS) nor server-side (Java Server
   * Pages, NodeJS, PHP, Golang, ...) browser applications. Using this endpoint in these applications will make
   * you vulnerable to a variety of CSRF attacks.
   *
   * This endpoint MUST ONLY be used in scenarios such as native mobile apps (React Native, Objective C, Swift, Java, ...).
   *
   * :::
   *
   * More information can be found at [Ory Kratos User Settings & Profile Management Documentation](../self-service/flows/user-settings).
   *
   * Equivalent to Ory Kratos API GET /self-service/settings/api
   */
  settingsFlow?: ?SettingsFlow,
|};


/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type ViewerApiKeyGetSelfServiceSettingsFlowArgs = {|
  id: $ElementType<Scalars, 'String'>,
|};


/** A viewer for security scheme 'sessionToken' in OAS 'Ory Kratos API' */
export type ViewerApiKeySessionArgs = {|
  authorization?: ?$ElementType<Scalars, 'String'>,
  cookie?: ?$ElementType<Scalars, 'String'>,
|};

type $Pick<Origin: Object, Keys: Object> = $ObjMapi<Keys, <Key>(k: Key) => $ElementType<Origin, Key>>;

export type Unnamed_1_QueryVariables = {};


export type Unnamed_1_Query = ({
    ...{ __typename?: 'Query' },
  ...$Pick<Query, {| ping?: * |}>
});

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export type SubscriptionSubscribeFn<Result, Parent, Context, Args> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => AsyncIterator<Result> | Promise<AsyncIterator<Result>>;

export type SubscriptionResolveFn<Result, Parent, Context, Args> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Result | Promise<Result>;

export interface SubscriptionSubscriberObject<Result, Key: string, Parent, Context, Args> {
  subscribe: SubscriptionSubscribeFn<{ [key: Key]: Result }, Parent, Context, Args>;
  resolve?: SubscriptionResolveFn<Result, { [key: Key]: Result }, Context, Args>;
}

export interface SubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe: SubscriptionSubscribeFn<mixed, Parent, Context, Args>;
  resolve: SubscriptionResolveFn<Result, mixed, Context, Args>;
}

export type SubscriptionObject<Result, Key: string, Parent, Context, Args> =
  | SubscriptionSubscriberObject<Result, Key, Parent, Context, Args>
  | SubscriptionResolverObject<Result, Parent, Context, Args>;

export type SubscriptionResolver<Result, Key: string, Parent = {}, Context = {}, Args = {}> =
  | ((...args: Array<any>) => SubscriptionObject<Result, Key, Parent, Context, Args>)
  | SubscriptionObject<Result, Key, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => ?Types | Promise<?Types>;

export type IsTypeOfResolverFn<T = {}, Context = {}> = (obj: T, context: Context, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<Result = {}, Parent = {}, Args = {}, Context = {}> = (
  next: NextResolverFn<Result>,
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Result | Promise<Result>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BigInt: ResolverTypeWrapper<$ElementType<Scalars, 'BigInt'>>,
  Boolean: ResolverTypeWrapper<$ElementType<Scalars, 'Boolean'>>,
  CompleteSelfServiceLoginFlowWithPasswordMethodInput: CompleteSelfServiceLoginFlowWithPasswordMethodInput,
  CompleteSelfServiceSettingsFlowWithPasswordMethodInput: CompleteSelfServiceSettingsFlowWithPasswordMethodInput,
  CreateIdentityInput: CreateIdentityInput,
  CreateRecoveryLinkInput: CreateRecoveryLinkInput,
  ErrorContainer: ResolverTypeWrapper<ErrorContainer>,
  HealthAlive: ResolverTypeWrapper<HealthAlive>,
  HealthReady: ResolverTypeWrapper<HealthReady>,
  Identity: ResolverTypeWrapper<Identity>,
  JSON: ResolverTypeWrapper<$ElementType<Scalars, 'JSON'>>,
  LoginFlow: ResolverTypeWrapper<LoginFlow>,
  LoginViaApiResponse: ResolverTypeWrapper<LoginViaApiResponse>,
  Mutation: ResolverTypeWrapper<{}>,
  MutationViewerAnyAuth: ResolverTypeWrapper<MutationViewerAnyAuth>,
  MutationViewerApiKey: ResolverTypeWrapper<MutationViewerApiKey>,
  Query: ResolverTypeWrapper<{}>,
  RecoveryAddress: ResolverTypeWrapper<RecoveryAddress>,
  RecoveryFlow: ResolverTypeWrapper<RecoveryFlow>,
  RecoveryLink: ResolverTypeWrapper<RecoveryLink>,
  RegistrationFlow: ResolverTypeWrapper<RegistrationFlow>,
  RegistrationViaApiResponse: ResolverTypeWrapper<RegistrationViaApiResponse>,
  Session: ResolverTypeWrapper<Session>,
  SessionCookieInput: SessionCookieInput,
  SessionTokenInput: SessionTokenInput,
  SettingsFlow: ResolverTypeWrapper<SettingsFlow>,
  SettingsViaApiResponse: ResolverTypeWrapper<SettingsViaApiResponse>,
  String: ResolverTypeWrapper<$ElementType<Scalars, 'String'>>,
  UiContainer: ResolverTypeWrapper<UiContainer>,
  UiNode: ResolverTypeWrapper<$Diff<UiNode, { attributes: *  }> & { attributes: $ElementType<ResolversTypes, 'UiNodeAttributes'> }>,
  UiNodeAnchorAttributes: ResolverTypeWrapper<UiNodeAnchorAttributes>,
  UiNodeAttributes: $ElementType<ResolversTypes, 'UiNodeAnchorAttributes'> | $ElementType<ResolversTypes, 'UiNodeImageAttributes'> | $ElementType<ResolversTypes, 'UiNodeInputAttributes'> | $ElementType<ResolversTypes, 'UiNodeTextAttributes'>,
  UiNodeImageAttributes: ResolverTypeWrapper<UiNodeImageAttributes>,
  UiNodeInputAttributes: ResolverTypeWrapper<UiNodeInputAttributes>,
  UiNodeTextAttributes: ResolverTypeWrapper<UiNodeTextAttributes>,
  UiText: ResolverTypeWrapper<UiText>,
  UpdateIdentityInput: UpdateIdentityInput,
  VerifiableAddress: ResolverTypeWrapper<VerifiableAddress>,
  VerificationFlow: ResolverTypeWrapper<VerificationFlow>,
  Version: ResolverTypeWrapper<Version>,
  ViewerAnyAuth: ResolverTypeWrapper<ViewerAnyAuth>,
  ViewerApiKey: ResolverTypeWrapper<ViewerApiKey>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BigInt: $ElementType<Scalars, 'BigInt'>,
  Boolean: $ElementType<Scalars, 'Boolean'>,
  CompleteSelfServiceLoginFlowWithPasswordMethodInput: CompleteSelfServiceLoginFlowWithPasswordMethodInput,
  CompleteSelfServiceSettingsFlowWithPasswordMethodInput: CompleteSelfServiceSettingsFlowWithPasswordMethodInput,
  CreateIdentityInput: CreateIdentityInput,
  CreateRecoveryLinkInput: CreateRecoveryLinkInput,
  ErrorContainer: ErrorContainer,
  HealthAlive: HealthAlive,
  HealthReady: HealthReady,
  Identity: Identity,
  JSON: $ElementType<Scalars, 'JSON'>,
  LoginFlow: LoginFlow,
  LoginViaApiResponse: LoginViaApiResponse,
  Mutation: {},
  MutationViewerAnyAuth: MutationViewerAnyAuth,
  MutationViewerApiKey: MutationViewerApiKey,
  Query: {},
  RecoveryAddress: RecoveryAddress,
  RecoveryFlow: RecoveryFlow,
  RecoveryLink: RecoveryLink,
  RegistrationFlow: RegistrationFlow,
  RegistrationViaApiResponse: RegistrationViaApiResponse,
  Session: Session,
  SessionCookieInput: SessionCookieInput,
  SessionTokenInput: SessionTokenInput,
  SettingsFlow: SettingsFlow,
  SettingsViaApiResponse: SettingsViaApiResponse,
  String: $ElementType<Scalars, 'String'>,
  UiContainer: UiContainer,
  UiNode: $Diff<UiNode, { attributes: *  }> & { attributes: $ElementType<ResolversParentTypes, 'UiNodeAttributes'> },
  UiNodeAnchorAttributes: UiNodeAnchorAttributes,
  UiNodeAttributes: $ElementType<ResolversParentTypes, 'UiNodeAnchorAttributes'> | $ElementType<ResolversParentTypes, 'UiNodeImageAttributes'> | $ElementType<ResolversParentTypes, 'UiNodeInputAttributes'> | $ElementType<ResolversParentTypes, 'UiNodeTextAttributes'>,
  UiNodeImageAttributes: UiNodeImageAttributes,
  UiNodeInputAttributes: UiNodeInputAttributes,
  UiNodeTextAttributes: UiNodeTextAttributes,
  UiText: UiText,
  UpdateIdentityInput: UpdateIdentityInput,
  VerifiableAddress: VerifiableAddress,
  VerificationFlow: VerificationFlow,
  Version: Version,
  ViewerAnyAuth: ViewerAnyAuth,
  ViewerApiKey: ViewerApiKey,
};

export type BigIntScalarConfig = {
  ...GraphQLScalarTypeConfig<$ElementType<ResolversTypes, 'BigInt'>, any>,
  name: 'BigInt'
};

export type ErrorContainerResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'ErrorContainer'>> = {
  errors?: Resolver<Array<?$ElementType<ResolversTypes, 'JSON'>>, ParentType, ContextType>,
  id?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type HealthAliveResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'HealthAlive'>> = {
  status?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type HealthReadyResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'HealthReady'>> = {
  status?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type IdentityResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'Identity'>> = {
  id?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  recoveryAddresses?: Resolver<?Array<?$ElementType<ResolversTypes, 'RecoveryAddress'>>, ParentType, ContextType>,
  schemaId?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  schemaUrl?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  traits?: Resolver<$ElementType<ResolversTypes, 'JSON'>, ParentType, ContextType>,
  verifiableAddresses?: Resolver<?Array<?$ElementType<ResolversTypes, 'VerifiableAddress'>>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type JsonScalarConfig = {
  ...GraphQLScalarTypeConfig<$ElementType<ResolversTypes, 'JSON'>, any>,
  name: 'JSON'
};

export type LoginFlowResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'LoginFlow'>> = {
  active?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  expiresAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  forced?: Resolver<?$ElementType<ResolversTypes, 'Boolean'>, ParentType, ContextType>,
  id?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  issuedAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  requestUrl?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  type?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  ui?: Resolver<$ElementType<ResolversTypes, 'UiContainer'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type LoginViaApiResponseResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'LoginViaApiResponse'>> = {
  session?: Resolver<$ElementType<ResolversTypes, 'Session'>, ParentType, ContextType>,
  sessionToken?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type MutationResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'Mutation'>> = {
  completeSelfServiceLoginFlowWithPasswordMethod?: Resolver<?$ElementType<ResolversTypes, 'LoginViaApiResponse'>, ParentType, ContextType, $RequireFields<MutationCompleteSelfServiceLoginFlowWithPasswordMethodArgs, { flow: * }>>,
  completeSelfServiceRegistrationFlowWithPasswordMethod?: Resolver<?$ElementType<ResolversTypes, 'RegistrationViaApiResponse'>, ParentType, ContextType, MutationCompleteSelfServiceRegistrationFlowWithPasswordMethodArgs>,
  createIdentity?: Resolver<?$ElementType<ResolversTypes, 'Identity'>, ParentType, ContextType, MutationCreateIdentityArgs>,
  createRecoveryLink?: Resolver<?$ElementType<ResolversTypes, 'RecoveryLink'>, ParentType, ContextType, MutationCreateRecoveryLinkArgs>,
  mutationViewerAnyAuth?: Resolver<?$ElementType<ResolversTypes, 'MutationViewerAnyAuth'>, ParentType, ContextType, MutationMutationViewerAnyAuthArgs>,
  mutationViewerApiKey?: Resolver<?$ElementType<ResolversTypes, 'MutationViewerApiKey'>, ParentType, ContextType, $RequireFields<MutationMutationViewerApiKeyArgs, { apiKey: * }>>,
  ping?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  updateIdentity?: Resolver<?$ElementType<ResolversTypes, 'Identity'>, ParentType, ContextType, $RequireFields<MutationUpdateIdentityArgs, { id: * }>>,
};

export type MutationViewerAnyAuthResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'MutationViewerAnyAuth'>> = {
  completeSelfServiceSettingsFlowWithPasswordMethod?: Resolver<?$ElementType<ResolversTypes, 'SettingsViaApiResponse'>, ParentType, ContextType, MutationViewerAnyAuthCompleteSelfServiceSettingsFlowWithPasswordMethodArgs>,
  completeSelfServiceSettingsFlowWithProfileMethod?: Resolver<?$ElementType<ResolversTypes, 'SettingsFlow'>, ParentType, ContextType, MutationViewerAnyAuthCompleteSelfServiceSettingsFlowWithProfileMethodArgs>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type MutationViewerApiKeyResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'MutationViewerApiKey'>> = {
  completeSelfServiceSettingsFlowWithPasswordMethod?: Resolver<?$ElementType<ResolversTypes, 'SettingsViaApiResponse'>, ParentType, ContextType, MutationViewerApiKeyCompleteSelfServiceSettingsFlowWithPasswordMethodArgs>,
  completeSelfServiceSettingsFlowWithProfileMethod?: Resolver<?$ElementType<ResolversTypes, 'SettingsFlow'>, ParentType, ContextType, MutationViewerApiKeyCompleteSelfServiceSettingsFlowWithProfileMethodArgs>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'Query'>> = {
  errorContainer?: Resolver<?$ElementType<ResolversTypes, 'ErrorContainer'>, ParentType, ContextType, $RequireFields<QueryErrorContainerArgs, { error: * }>>,
  getSelfServiceLoginFlow?: Resolver<?$ElementType<ResolversTypes, 'LoginFlow'>, ParentType, ContextType, $RequireFields<QueryGetSelfServiceLoginFlowArgs, { id: * }>>,
  getSelfServiceRecoveryFlow?: Resolver<?$ElementType<ResolversTypes, 'RecoveryFlow'>, ParentType, ContextType, $RequireFields<QueryGetSelfServiceRecoveryFlowArgs, { id: * }>>,
  getSelfServiceRegistrationFlow?: Resolver<?$ElementType<ResolversTypes, 'RegistrationFlow'>, ParentType, ContextType, $RequireFields<QueryGetSelfServiceRegistrationFlowArgs, { id: * }>>,
  getSelfServiceVerificationFlow?: Resolver<?$ElementType<ResolversTypes, 'VerificationFlow'>, ParentType, ContextType, $RequireFields<QueryGetSelfServiceVerificationFlowArgs, { id: * }>>,
  healthAlive?: Resolver<?$ElementType<ResolversTypes, 'HealthAlive'>, ParentType, ContextType>,
  healthReady?: Resolver<?$ElementType<ResolversTypes, 'HealthReady'>, ParentType, ContextType>,
  identities?: Resolver<?Array<?$ElementType<ResolversTypes, 'Identity'>>, ParentType, ContextType, QueryIdentitiesArgs>,
  identity?: Resolver<?$ElementType<ResolversTypes, 'Identity'>, ParentType, ContextType, $RequireFields<QueryIdentityArgs, { id: * }>>,
  jsonSchema?: Resolver<?$ElementType<ResolversTypes, 'JSON'>, ParentType, ContextType, $RequireFields<QueryJsonSchemaArgs, { id: * }>>,
  loginFlow?: Resolver<?$ElementType<ResolversTypes, 'LoginFlow'>, ParentType, ContextType, QueryLoginFlowArgs>,
  ping?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  recoveryFlow?: Resolver<?$ElementType<ResolversTypes, 'RecoveryFlow'>, ParentType, ContextType>,
  registrationFlow?: Resolver<?$ElementType<ResolversTypes, 'RegistrationFlow'>, ParentType, ContextType>,
  verificationFlow?: Resolver<?$ElementType<ResolversTypes, 'VerificationFlow'>, ParentType, ContextType>,
  version?: Resolver<?$ElementType<ResolversTypes, 'Version'>, ParentType, ContextType>,
  viewerAnyAuth?: Resolver<?$ElementType<ResolversTypes, 'ViewerAnyAuth'>, ParentType, ContextType, QueryViewerAnyAuthArgs>,
  viewerApiKey?: Resolver<?$ElementType<ResolversTypes, 'ViewerApiKey'>, ParentType, ContextType, $RequireFields<QueryViewerApiKeyArgs, { apiKey: * }>>,
};

export type RecoveryAddressResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'RecoveryAddress'>> = {
  id?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  value?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  via?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type RecoveryFlowResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'RecoveryFlow'>> = {
  active?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  expiresAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  id?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  issuedAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  messages?: Resolver<?Array<?$ElementType<ResolversTypes, 'UiText'>>, ParentType, ContextType>,
  methods?: Resolver<$ElementType<ResolversTypes, 'JSON'>, ParentType, ContextType>,
  requestUrl?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  state?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  type?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type RecoveryLinkResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'RecoveryLink'>> = {
  expiresAt?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  recoveryLink?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type RegistrationFlowResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'RegistrationFlow'>> = {
  active?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  expiresAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  id?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  issuedAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  messages?: Resolver<?Array<?$ElementType<ResolversTypes, 'UiText'>>, ParentType, ContextType>,
  methods?: Resolver<$ElementType<ResolversTypes, 'JSON'>, ParentType, ContextType>,
  requestUrl?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  type?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type RegistrationViaApiResponseResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'RegistrationViaApiResponse'>> = {
  identity?: Resolver<$ElementType<ResolversTypes, 'Identity'>, ParentType, ContextType>,
  session?: Resolver<?$ElementType<ResolversTypes, 'Session'>, ParentType, ContextType>,
  sessionToken?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type SessionResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'Session'>> = {
  active?: Resolver<?$ElementType<ResolversTypes, 'Boolean'>, ParentType, ContextType>,
  authenticatedAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  expiresAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  id?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  identity?: Resolver<$ElementType<ResolversTypes, 'Identity'>, ParentType, ContextType>,
  issuedAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type SettingsFlowResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'SettingsFlow'>> = {
  active?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  expiresAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  id?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  identity?: Resolver<$ElementType<ResolversTypes, 'Identity'>, ParentType, ContextType>,
  issuedAt?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  messages?: Resolver<?Array<?$ElementType<ResolversTypes, 'UiText'>>, ParentType, ContextType>,
  methods?: Resolver<$ElementType<ResolversTypes, 'JSON'>, ParentType, ContextType>,
  requestUrl?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  state?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  type?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type SettingsViaApiResponseResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'SettingsViaApiResponse'>> = {
  flow?: Resolver<$ElementType<ResolversTypes, 'SettingsFlow'>, ParentType, ContextType>,
  identity?: Resolver<$ElementType<ResolversTypes, 'Identity'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type UiContainerResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'UiContainer'>> = {
  action?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  messages?: Resolver<?Array<?$ElementType<ResolversTypes, 'UiText'>>, ParentType, ContextType>,
  method?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  nodes?: Resolver<Array<?$ElementType<ResolversTypes, 'UiNode'>>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type UiNodeResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'UiNode'>> = {
  attributes?: Resolver<$ElementType<ResolversTypes, 'UiNodeAttributes'>, ParentType, ContextType>,
  group?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  messages?: Resolver<Array<?$ElementType<ResolversTypes, 'UiText'>>, ParentType, ContextType>,
  type?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type UiNodeAnchorAttributesResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'UiNodeAnchorAttributes'>> = {
  href?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  title?: Resolver<$ElementType<ResolversTypes, 'UiText'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type UiNodeAttributesResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'UiNodeAttributes'>> = {
  __resolveType: TypeResolveFn<'UiNodeAnchorAttributes' | 'UiNodeImageAttributes' | 'UiNodeInputAttributes' | 'UiNodeTextAttributes', ParentType, ContextType>,
};

export type UiNodeImageAttributesResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'UiNodeImageAttributes'>> = {
  src?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type UiNodeInputAttributesResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'UiNodeInputAttributes'>> = {
  disabled?: Resolver<$ElementType<ResolversTypes, 'Boolean'>, ParentType, ContextType>,
  label?: Resolver<?$ElementType<ResolversTypes, 'UiText'>, ParentType, ContextType>,
  name?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  pattern?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  required?: Resolver<?$ElementType<ResolversTypes, 'Boolean'>, ParentType, ContextType>,
  type?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  value?: Resolver<?$ElementType<ResolversTypes, 'JSON'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type UiNodeTextAttributesResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'UiNodeTextAttributes'>> = {
  text?: Resolver<$ElementType<ResolversTypes, 'UiText'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type UiTextResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'UiText'>> = {
  context?: Resolver<?$ElementType<ResolversTypes, 'JSON'>, ParentType, ContextType>,
  id?: Resolver<$ElementType<ResolversTypes, 'BigInt'>, ParentType, ContextType>,
  text?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  type?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type VerifiableAddressResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'VerifiableAddress'>> = {
  id?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  status?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  value?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  verified?: Resolver<$ElementType<ResolversTypes, 'Boolean'>, ParentType, ContextType>,
  verifiedAt?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  via?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type VerificationFlowResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'VerificationFlow'>> = {
  active?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  expiresAt?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  id?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  issuedAt?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  messages?: Resolver<?Array<?$ElementType<ResolversTypes, 'UiText'>>, ParentType, ContextType>,
  methods?: Resolver<$ElementType<ResolversTypes, 'JSON'>, ParentType, ContextType>,
  requestUrl?: Resolver<?$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  state?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  type?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type VersionResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'Version'>> = {
  version?: Resolver<$ElementType<ResolversTypes, 'String'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type ViewerAnyAuthResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'ViewerAnyAuth'>> = {
  getSelfServiceSettingsFlow?: Resolver<?$ElementType<ResolversTypes, 'SettingsFlow'>, ParentType, ContextType, $RequireFields<ViewerAnyAuthGetSelfServiceSettingsFlowArgs, { id: * }>>,
  session?: Resolver<?$ElementType<ResolversTypes, 'Session'>, ParentType, ContextType, ViewerAnyAuthSessionArgs>,
  settingsFlow?: Resolver<?$ElementType<ResolversTypes, 'SettingsFlow'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type ViewerApiKeyResolvers<ContextType = any, ParentType = $ElementType<ResolversParentTypes, 'ViewerApiKey'>> = {
  getSelfServiceSettingsFlow?: Resolver<?$ElementType<ResolversTypes, 'SettingsFlow'>, ParentType, ContextType, $RequireFields<ViewerApiKeyGetSelfServiceSettingsFlowArgs, { id: * }>>,
  session?: Resolver<?$ElementType<ResolversTypes, 'Session'>, ParentType, ContextType, ViewerApiKeySessionArgs>,
  settingsFlow?: Resolver<?$ElementType<ResolversTypes, 'SettingsFlow'>, ParentType, ContextType>,
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  BigInt?: GraphQLScalarType,
  ErrorContainer?: ErrorContainerResolvers<ContextType>,
  HealthAlive?: HealthAliveResolvers<ContextType>,
  HealthReady?: HealthReadyResolvers<ContextType>,
  Identity?: IdentityResolvers<ContextType>,
  JSON?: GraphQLScalarType,
  LoginFlow?: LoginFlowResolvers<ContextType>,
  LoginViaApiResponse?: LoginViaApiResponseResolvers<ContextType>,
  Mutation?: MutationResolvers<ContextType>,
  MutationViewerAnyAuth?: MutationViewerAnyAuthResolvers<ContextType>,
  MutationViewerApiKey?: MutationViewerApiKeyResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  RecoveryAddress?: RecoveryAddressResolvers<ContextType>,
  RecoveryFlow?: RecoveryFlowResolvers<ContextType>,
  RecoveryLink?: RecoveryLinkResolvers<ContextType>,
  RegistrationFlow?: RegistrationFlowResolvers<ContextType>,
  RegistrationViaApiResponse?: RegistrationViaApiResponseResolvers<ContextType>,
  Session?: SessionResolvers<ContextType>,
  SettingsFlow?: SettingsFlowResolvers<ContextType>,
  SettingsViaApiResponse?: SettingsViaApiResponseResolvers<ContextType>,
  UiContainer?: UiContainerResolvers<ContextType>,
  UiNode?: UiNodeResolvers<ContextType>,
  UiNodeAnchorAttributes?: UiNodeAnchorAttributesResolvers<ContextType>,
  UiNodeAttributes?: UiNodeAttributesResolvers<ContextType>,
  UiNodeImageAttributes?: UiNodeImageAttributesResolvers<ContextType>,
  UiNodeInputAttributes?: UiNodeInputAttributesResolvers<ContextType>,
  UiNodeTextAttributes?: UiNodeTextAttributesResolvers<ContextType>,
  UiText?: UiTextResolvers<ContextType>,
  VerifiableAddress?: VerifiableAddressResolvers<ContextType>,
  VerificationFlow?: VerificationFlowResolvers<ContextType>,
  Version?: VersionResolvers<ContextType>,
  ViewerAnyAuth?: ViewerAnyAuthResolvers<ContextType>,
  ViewerApiKey?: ViewerApiKeyResolvers<ContextType>,
};





      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "UiNodeAttributes": [
      "UiNodeAnchorAttributes",
      "UiNodeImageAttributes",
      "UiNodeInputAttributes",
      "UiNodeTextAttributes"
    ]
  }
};
      export default result;
    
import { IntrospectionQuery } from 'graphql';
export default {
  "__schema": {
    "queryType": {
      "name": "Query"
    },
    "mutationType": {
      "name": "Mutation"
    },
    "subscriptionType": null,
    "types": [
      {
        "kind": "OBJECT",
        "name": "ErrorContainer",
        "fields": [
          {
            "name": "errors",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "HealthAlive",
        "fields": [
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "HealthReady",
        "fields": [
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Identity",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "recoveryAddresses",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "RecoveryAddress",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "schemaId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "schemaUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "traits",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "verifiableAddresses",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "VerifiableAddress",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "LoginFlow",
        "fields": [
          {
            "name": "active",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "expiresAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "forced",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "issuedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "requestUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "type",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "ui",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UiContainer",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "LoginViaApiResponse",
        "fields": [
          {
            "name": "session",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Session",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "sessionToken",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Mutation",
        "fields": [
          {
            "name": "completeSelfServiceLoginFlowWithPasswordMethod",
            "type": {
              "kind": "OBJECT",
              "name": "LoginViaApiResponse",
              "ofType": null
            },
            "args": [
              {
                "name": "completeSelfServiceLoginFlowWithPasswordMethodInput",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "flow",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "completeSelfServiceRegistrationFlowWithPasswordMethod",
            "type": {
              "kind": "OBJECT",
              "name": "RegistrationViaApiResponse",
              "ofType": null
            },
            "args": [
              {
                "name": "flow",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "selfServiceRegistrationMethodsPasswordInput",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "createIdentity",
            "type": {
              "kind": "OBJECT",
              "name": "Identity",
              "ofType": null
            },
            "args": [
              {
                "name": "createIdentityInput",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "createRecoveryLink",
            "type": {
              "kind": "OBJECT",
              "name": "RecoveryLink",
              "ofType": null
            },
            "args": [
              {
                "name": "createRecoveryLinkInput",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "mutationViewerAnyAuth",
            "type": {
              "kind": "OBJECT",
              "name": "MutationViewerAnyAuth",
              "ofType": null
            },
            "args": [
              {
                "name": "sessionCookie",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "sessionToken",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "mutationViewerApiKey",
            "type": {
              "kind": "OBJECT",
              "name": "MutationViewerApiKey",
              "ofType": null
            },
            "args": [
              {
                "name": "apiKey",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "ping",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "updateIdentity",
            "type": {
              "kind": "OBJECT",
              "name": "Identity",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "updateIdentityInput",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "MutationViewerAnyAuth",
        "fields": [
          {
            "name": "completeSelfServiceSettingsFlowWithPasswordMethod",
            "type": {
              "kind": "OBJECT",
              "name": "SettingsViaApiResponse",
              "ofType": null
            },
            "args": [
              {
                "name": "completeSelfServiceSettingsFlowWithPasswordMethodInput",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "flow",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "completeSelfServiceSettingsFlowWithProfileMethod",
            "type": {
              "kind": "OBJECT",
              "name": "SettingsFlow",
              "ofType": null
            },
            "args": [
              {
                "name": "flow",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "selfServiceSettingsMethodsProfileInput",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "MutationViewerApiKey",
        "fields": [
          {
            "name": "completeSelfServiceSettingsFlowWithPasswordMethod",
            "type": {
              "kind": "OBJECT",
              "name": "SettingsViaApiResponse",
              "ofType": null
            },
            "args": [
              {
                "name": "completeSelfServiceSettingsFlowWithPasswordMethodInput",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "flow",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "completeSelfServiceSettingsFlowWithProfileMethod",
            "type": {
              "kind": "OBJECT",
              "name": "SettingsFlow",
              "ofType": null
            },
            "args": [
              {
                "name": "flow",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "selfServiceSettingsMethodsProfileInput",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Query",
        "fields": [
          {
            "name": "errorContainer",
            "type": {
              "kind": "OBJECT",
              "name": "ErrorContainer",
              "ofType": null
            },
            "args": [
              {
                "name": "error",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "getSelfServiceLoginFlow",
            "type": {
              "kind": "OBJECT",
              "name": "LoginFlow",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "getSelfServiceRecoveryFlow",
            "type": {
              "kind": "OBJECT",
              "name": "RecoveryFlow",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "getSelfServiceRegistrationFlow",
            "type": {
              "kind": "OBJECT",
              "name": "RegistrationFlow",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "getSelfServiceVerificationFlow",
            "type": {
              "kind": "OBJECT",
              "name": "VerificationFlow",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "healthAlive",
            "type": {
              "kind": "OBJECT",
              "name": "HealthAlive",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "healthReady",
            "type": {
              "kind": "OBJECT",
              "name": "HealthReady",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "identities",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Identity",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "page",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "perPage",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "identity",
            "type": {
              "kind": "OBJECT",
              "name": "Identity",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "jsonSchema",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "loginFlow",
            "type": {
              "kind": "OBJECT",
              "name": "LoginFlow",
              "ofType": null
            },
            "args": [
              {
                "name": "refresh",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "ping",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "recoveryFlow",
            "type": {
              "kind": "OBJECT",
              "name": "RecoveryFlow",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "registrationFlow",
            "type": {
              "kind": "OBJECT",
              "name": "RegistrationFlow",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "verificationFlow",
            "type": {
              "kind": "OBJECT",
              "name": "VerificationFlow",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "version",
            "type": {
              "kind": "OBJECT",
              "name": "Version",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "viewerAnyAuth",
            "type": {
              "kind": "OBJECT",
              "name": "ViewerAnyAuth",
              "ofType": null
            },
            "args": [
              {
                "name": "sessionCookie",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "sessionToken",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "viewerApiKey",
            "type": {
              "kind": "OBJECT",
              "name": "ViewerApiKey",
              "ofType": null
            },
            "args": [
              {
                "name": "apiKey",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "RecoveryAddress",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "via",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "RecoveryFlow",
        "fields": [
          {
            "name": "active",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "expiresAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "issuedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "messages",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "UiText",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "methods",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "requestUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "state",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "type",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "RecoveryLink",
        "fields": [
          {
            "name": "expiresAt",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "recoveryLink",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "RegistrationFlow",
        "fields": [
          {
            "name": "active",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "expiresAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "issuedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "messages",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "UiText",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "methods",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "requestUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "type",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "RegistrationViaApiResponse",
        "fields": [
          {
            "name": "identity",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Identity",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "session",
            "type": {
              "kind": "OBJECT",
              "name": "Session",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "sessionToken",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Session",
        "fields": [
          {
            "name": "active",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "authenticatedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "expiresAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "identity",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Identity",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "issuedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "SettingsFlow",
        "fields": [
          {
            "name": "active",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "expiresAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "identity",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Identity",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "issuedAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "messages",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "UiText",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "methods",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "requestUrl",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "state",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "type",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "SettingsViaApiResponse",
        "fields": [
          {
            "name": "flow",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SettingsFlow",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "identity",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Identity",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UiContainer",
        "fields": [
          {
            "name": "action",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "messages",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "UiText",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "method",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "nodes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "UiNode",
                  "ofType": null
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UiNode",
        "fields": [
          {
            "name": "attributes",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "UNION",
                "name": "UiNodeAttributes",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "group",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "messages",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "UiText",
                  "ofType": null
                }
              }
            },
            "args": []
          },
          {
            "name": "type",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UiNodeAnchorAttributes",
        "fields": [
          {
            "name": "href",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "title",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UiText",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "UNION",
        "name": "UiNodeAttributes",
        "possibleTypes": [
          {
            "kind": "OBJECT",
            "name": "UiNodeAnchorAttributes"
          },
          {
            "kind": "OBJECT",
            "name": "UiNodeImageAttributes"
          },
          {
            "kind": "OBJECT",
            "name": "UiNodeInputAttributes"
          },
          {
            "kind": "OBJECT",
            "name": "UiNodeTextAttributes"
          }
        ]
      },
      {
        "kind": "OBJECT",
        "name": "UiNodeImageAttributes",
        "fields": [
          {
            "name": "src",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UiNodeInputAttributes",
        "fields": [
          {
            "name": "disabled",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "label",
            "type": {
              "kind": "OBJECT",
              "name": "UiText",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "pattern",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "required",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "type",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "value",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UiNodeTextAttributes",
        "fields": [
          {
            "name": "text",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UiText",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UiText",
        "fields": [
          {
            "name": "context",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "text",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "type",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "VerifiableAddress",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "status",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "value",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "verified",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "verifiedAt",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "via",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "VerificationFlow",
        "fields": [
          {
            "name": "active",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "expiresAt",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "issuedAt",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "messages",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "UiText",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "methods",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "requestUrl",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "state",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "type",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Version",
        "fields": [
          {
            "name": "version",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ViewerAnyAuth",
        "fields": [
          {
            "name": "getSelfServiceSettingsFlow",
            "type": {
              "kind": "OBJECT",
              "name": "SettingsFlow",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "session",
            "type": {
              "kind": "OBJECT",
              "name": "Session",
              "ofType": null
            },
            "args": [
              {
                "name": "authorization",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "cookie",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "settingsFlow",
            "type": {
              "kind": "OBJECT",
              "name": "SettingsFlow",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "ViewerApiKey",
        "fields": [
          {
            "name": "getSelfServiceSettingsFlow",
            "type": {
              "kind": "OBJECT",
              "name": "SettingsFlow",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "session",
            "type": {
              "kind": "OBJECT",
              "name": "Session",
              "ofType": null
            },
            "args": [
              {
                "name": "authorization",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "cookie",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "settingsFlow",
            "type": {
              "kind": "OBJECT",
              "name": "SettingsFlow",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Any"
      }
    ],
    "directives": []
  }
} as unknown as IntrospectionQuery;