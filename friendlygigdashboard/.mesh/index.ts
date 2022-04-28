// @ts-nocheck
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type Query = {
  /**
   * For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
   *
   * Equivalent to GET /store/order/{orderId}
   */
  order?: Maybe<Order>;
  /**
   * Returns a single pet
   *
   * Equivalent to GET /pet/{petId}
   */
  pet?: Maybe<Pet>;
  /**
   * Multiple status values can be provided with comma separated strings
   *
   * Equivalent to GET /pet/findByStatus
   */
  petFindByStatus?: Maybe<Array<Maybe<Pet>>>;
  /**
   * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   *
   * Equivalent to GET /pet/findByTags
   */
  petFindByTags?: Maybe<Array<Maybe<Pet>>>;
  /**
   * Returns a map of status codes to quantities
   *
   * Equivalent to GET /store/inventory
   */
  storeInventory?: Maybe<Scalars['JSON']>;
  /**
   * Get user by user name
   *
   * Equivalent to GET /user/{username}
   */
  user?: Maybe<User>;
  /**
   * Logs user into the system
   *
   * Equivalent to GET /user/login
   */
  userLogin?: Maybe<Scalars['String']>;
  /**
   * Logs out current logged in user session
   *
   * Equivalent to GET /user/logout
   */
  userLogout?: Maybe<Scalars['JSON']>;
};


export type QueryorderArgs = {
  orderId: Scalars['Float'];
};


export type QuerypetArgs = {
  petId: Scalars['Float'];
};


export type QuerypetFindByStatusArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  status: Array<InputMaybe<Status4ListItem>>;
};


export type QuerypetFindByTagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  tags: Array<InputMaybe<Scalars['String']>>;
};


export type QueryuserArgs = {
  username: Scalars['String'];
};


export type QueryuserLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Order = {
  complete?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['Float']>;
  petId?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Int']>;
  shipDate?: Maybe<Scalars['String']>;
  /** Order Status */
  status?: Maybe<Status3>;
};

export type Status3 =
  | 'PLACED'
  | 'APPROVED'
  | 'DELIVERED';

export type Pet = {
  category?: Maybe<Category>;
  id?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  photoUrls: Array<Maybe<Scalars['String']>>;
  /** pet status in the store */
  status?: Maybe<Status>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type Category = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
};

export type Status =
  | 'AVAILABLE'
  | 'PENDING'
  | 'SOLD';

export type Tag = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
};

export type Status4ListItem =
  | 'AVAILABLE'
  | 'PENDING'
  | 'SOLD';

export type User = {
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Float']>;
  lastName?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  /** User Status */
  userStatus?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
};

export type Mutation = {
  /**
   * This can only be done by the logged in user.
   *
   * Equivalent to POST /user
   */
  createUser?: Maybe<Scalars['JSON']>;
  /**
   * Creates list of users with given input array
   *
   * Equivalent to POST /user/createWithArray
   */
  createUsersWithArrayInput?: Maybe<Scalars['JSON']>;
  /**
   * Creates list of users with given input array
   *
   * Equivalent to POST /user/createWithList
   */
  createUsersWithListInput?: Maybe<Scalars['JSON']>;
  /**
   * Place an order for a pet
   *
   * Equivalent to POST /store/order
   */
  placeOrder?: Maybe<Order>;
  /**
   * uploads an image
   *
   * Equivalent to POST /pet/{petId}/uploadImage
   */
  uploadFile?: Maybe<ApiResponse>;
};


export type MutationcreateUserArgs = {
  userInput: UserInput;
};


export type MutationcreateUsersWithArrayInputArgs = {
  userCreateWithArrayInput: Array<InputMaybe<UserInput>>;
};


export type MutationcreateUsersWithListInputArgs = {
  userCreateWithListInput: Array<InputMaybe<UserInput>>;
};


export type MutationplaceOrderArgs = {
  orderInput: OrderInput;
};


export type MutationuploadFileArgs = {
  multipartFormDataInput?: InputMaybe<Scalars['String']>;
  petId: Scalars['Float'];
};

export type UserInput = {
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Float']>;
  lastName?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  /** User Status */
  userStatus?: InputMaybe<Scalars['Int']>;
  username?: InputMaybe<Scalars['String']>;
};

export type OrderInput = {
  complete?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Float']>;
  petId?: InputMaybe<Scalars['Float']>;
  quantity?: InputMaybe<Scalars['Int']>;
  shipDate?: InputMaybe<Scalars['String']>;
  /** Order Status */
  status?: InputMaybe<Status3>;
};

export type ApiResponse = {
  code?: Maybe<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

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
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Order: ResolverTypeWrapper<Order>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Status3: Status3;
  Pet: ResolverTypeWrapper<Pet>;
  Category: ResolverTypeWrapper<Category>;
  Status: Status;
  Tag: ResolverTypeWrapper<Tag>;
  Status4ListItem: Status4ListItem;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  User: ResolverTypeWrapper<User>;
  Mutation: ResolverTypeWrapper<{}>;
  UserInput: UserInput;
  OrderInput: OrderInput;
  ApiResponse: ResolverTypeWrapper<ApiResponse>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  String: Scalars['String'];
  Order: Order;
  Boolean: Scalars['Boolean'];
  Pet: Pet;
  Category: Category;
  Tag: Tag;
  JSON: Scalars['JSON'];
  User: User;
  Mutation: {};
  UserInput: UserInput;
  OrderInput: OrderInput;
  ApiResponse: ApiResponse;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<QueryorderArgs, 'orderId'>>;
  pet?: Resolver<Maybe<ResolversTypes['Pet']>, ParentType, ContextType, RequireFields<QuerypetArgs, 'petId'>>;
  petFindByStatus?: Resolver<Maybe<Array<Maybe<ResolversTypes['Pet']>>>, ParentType, ContextType, RequireFields<QuerypetFindByStatusArgs, 'status'>>;
  petFindByTags?: Resolver<Maybe<Array<Maybe<ResolversTypes['Pet']>>>, ParentType, ContextType, RequireFields<QuerypetFindByTagsArgs, 'tags'>>;
  storeInventory?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'username'>>;
  userLogin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryuserLoginArgs, 'password' | 'username'>>;
  userLogout?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
}>;

export type OrderResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = ResolversObject<{
  complete?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  petId?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  shipDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['Status3']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Status3Resolvers = { PLACED: 'placed', APPROVED: 'approved', DELIVERED: 'delivered' };

export type PetResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Pet'] = ResolversParentTypes['Pet']> = ResolversObject<{
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  photoUrls?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['Status']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tag']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CategoryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatusResolvers = { AVAILABLE: 'available', PENDING: 'pending', SOLD: 'sold' };

export type TagResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Status4ListItemResolvers = { AVAILABLE: 'available', PENDING: 'pending', SOLD: 'sold' };

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userStatus?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createUser?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'userInput'>>;
  createUsersWithArrayInput?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<MutationcreateUsersWithArrayInputArgs, 'userCreateWithArrayInput'>>;
  createUsersWithListInput?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType, RequireFields<MutationcreateUsersWithListInputArgs, 'userCreateWithListInput'>>;
  placeOrder?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<MutationplaceOrderArgs, 'orderInput'>>;
  uploadFile?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationuploadFileArgs, 'petId'>>;
}>;

export type ApiResponseResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ApiResponse'] = ResolversParentTypes['ApiResponse']> = ResolversObject<{
  code?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  Status3?: Status3Resolvers;
  Pet?: PetResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Status?: StatusResolvers;
  Tag?: TagResolvers<ContextType>;
  Status4ListItem?: Status4ListItemResolvers;
  JSON?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  ApiResponse?: ApiResponseResolvers<ContextType>;
}>;


import { MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';

import { InContextSdkMethod } from '@graphql-mesh/types';


    export namespace BooksTypes {
      export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
};

export type Query = {
  /**
   * For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions
   *
   * Equivalent to GET /store/order/{orderId}
   */
  order?: Maybe<Order>;
  /**
   * Returns a single pet
   *
   * Equivalent to GET /pet/{petId}
   */
  pet?: Maybe<Pet>;
  /**
   * Multiple status values can be provided with comma separated strings
   *
   * Equivalent to GET /pet/findByStatus
   */
  petFindByStatus?: Maybe<Array<Maybe<Pet>>>;
  /**
   * Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.
   *
   * Equivalent to GET /pet/findByTags
   */
  petFindByTags?: Maybe<Array<Maybe<Pet>>>;
  /**
   * Returns a map of status codes to quantities
   *
   * Equivalent to GET /store/inventory
   */
  storeInventory?: Maybe<Scalars['JSON']>;
  /**
   * Get user by user name
   *
   * Equivalent to GET /user/{username}
   */
  user?: Maybe<User>;
  /**
   * Logs user into the system
   *
   * Equivalent to GET /user/login
   */
  userLogin?: Maybe<Scalars['String']>;
  /**
   * Logs out current logged in user session
   *
   * Equivalent to GET /user/logout
   */
  userLogout?: Maybe<Scalars['JSON']>;
};


export type QueryorderArgs = {
  orderId: Scalars['Float'];
};


export type QuerypetArgs = {
  petId: Scalars['Float'];
};


export type QuerypetFindByStatusArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  status: Array<InputMaybe<Status4ListItem>>;
};


export type QuerypetFindByTagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  tags: Array<InputMaybe<Scalars['String']>>;
};


export type QueryuserArgs = {
  username: Scalars['String'];
};


export type QueryuserLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Order = {
  complete?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['Float']>;
  petId?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Int']>;
  shipDate?: Maybe<Scalars['String']>;
  /** Order Status */
  status?: Maybe<Status3>;
};

export type Status3 =
  | 'PLACED'
  | 'APPROVED'
  | 'DELIVERED';

export type Pet = {
  category?: Maybe<Category>;
  id?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  photoUrls: Array<Maybe<Scalars['String']>>;
  /** pet status in the store */
  status?: Maybe<Status>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type Category = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
};

export type Status =
  | 'AVAILABLE'
  | 'PENDING'
  | 'SOLD';

export type Tag = {
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
};

export type Status4ListItem =
  | 'AVAILABLE'
  | 'PENDING'
  | 'SOLD';

export type User = {
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Float']>;
  lastName?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  /** User Status */
  userStatus?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
};

export type Mutation = {
  /**
   * This can only be done by the logged in user.
   *
   * Equivalent to POST /user
   */
  createUser?: Maybe<Scalars['JSON']>;
  /**
   * Creates list of users with given input array
   *
   * Equivalent to POST /user/createWithArray
   */
  createUsersWithArrayInput?: Maybe<Scalars['JSON']>;
  /**
   * Creates list of users with given input array
   *
   * Equivalent to POST /user/createWithList
   */
  createUsersWithListInput?: Maybe<Scalars['JSON']>;
  /**
   * Place an order for a pet
   *
   * Equivalent to POST /store/order
   */
  placeOrder?: Maybe<Order>;
  /**
   * uploads an image
   *
   * Equivalent to POST /pet/{petId}/uploadImage
   */
  uploadFile?: Maybe<ApiResponse>;
};


export type MutationcreateUserArgs = {
  userInput: UserInput;
};


export type MutationcreateUsersWithArrayInputArgs = {
  userCreateWithArrayInput: Array<InputMaybe<UserInput>>;
};


export type MutationcreateUsersWithListInputArgs = {
  userCreateWithListInput: Array<InputMaybe<UserInput>>;
};


export type MutationplaceOrderArgs = {
  orderInput: OrderInput;
};


export type MutationuploadFileArgs = {
  multipartFormDataInput?: InputMaybe<Scalars['String']>;
  petId: Scalars['Float'];
};

export type UserInput = {
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Float']>;
  lastName?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  /** User Status */
  userStatus?: InputMaybe<Scalars['Int']>;
  username?: InputMaybe<Scalars['String']>;
};

export type OrderInput = {
  complete?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['Float']>;
  petId?: InputMaybe<Scalars['Float']>;
  quantity?: InputMaybe<Scalars['Int']>;
  shipDate?: InputMaybe<Scalars['String']>;
  /** Order Status */
  status?: InputMaybe<Status3>;
};

export type ApiResponse = {
  code?: Maybe<Scalars['Int']>;
  message?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

    }
    export type QueryBooksSdk = {
  /** For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions

Equivalent to GET /store/order/{orderId} **/
  order: InContextSdkMethod<BooksTypes.Query['order'], BooksTypes.QueryorderArgs, MeshContext>,
  /** Returns a single pet

Equivalent to GET /pet/{petId} **/
  pet: InContextSdkMethod<BooksTypes.Query['pet'], BooksTypes.QuerypetArgs, MeshContext>,
  /** Multiple status values can be provided with comma separated strings

Equivalent to GET /pet/findByStatus **/
  petFindByStatus: InContextSdkMethod<BooksTypes.Query['petFindByStatus'], BooksTypes.QuerypetFindByStatusArgs, MeshContext>,
  /** Multiple tags can be provided with comma separated strings. Use tag1, tag2, tag3 for testing.

Equivalent to GET /pet/findByTags **/
  petFindByTags: InContextSdkMethod<BooksTypes.Query['petFindByTags'], BooksTypes.QuerypetFindByTagsArgs, MeshContext>,
  /** Returns a map of status codes to quantities

Equivalent to GET /store/inventory **/
  storeInventory: InContextSdkMethod<BooksTypes.Query['storeInventory'], {}, MeshContext>,
  /** Get user by user name

Equivalent to GET /user/{username} **/
  user: InContextSdkMethod<BooksTypes.Query['user'], BooksTypes.QueryuserArgs, MeshContext>,
  /** Logs user into the system

Equivalent to GET /user/login **/
  userLogin: InContextSdkMethod<BooksTypes.Query['userLogin'], BooksTypes.QueryuserLoginArgs, MeshContext>,
  /** Logs out current logged in user session

Equivalent to GET /user/logout **/
  userLogout: InContextSdkMethod<BooksTypes.Query['userLogout'], {}, MeshContext>
};

export type MutationBooksSdk = {
  /** This can only be done by the logged in user.

Equivalent to POST /user **/
  createUser: InContextSdkMethod<BooksTypes.Mutation['createUser'], BooksTypes.MutationcreateUserArgs, MeshContext>,
  /** Creates list of users with given input array

Equivalent to POST /user/createWithArray **/
  createUsersWithArrayInput: InContextSdkMethod<BooksTypes.Mutation['createUsersWithArrayInput'], BooksTypes.MutationcreateUsersWithArrayInputArgs, MeshContext>,
  /** Creates list of users with given input array

Equivalent to POST /user/createWithList **/
  createUsersWithListInput: InContextSdkMethod<BooksTypes.Mutation['createUsersWithListInput'], BooksTypes.MutationcreateUsersWithListInputArgs, MeshContext>,
  /** Place an order for a pet

Equivalent to POST /store/order **/
  placeOrder: InContextSdkMethod<BooksTypes.Mutation['placeOrder'], BooksTypes.MutationplaceOrderArgs, MeshContext>,
  /** uploads an image

Equivalent to POST /pet/{petId}/uploadImage **/
  uploadFile: InContextSdkMethod<BooksTypes.Mutation['uploadFile'], BooksTypes.MutationuploadFileArgs, MeshContext>
};

export type SubscriptionBooksSdk = {

};

export type BooksContext = {
      ["Books"]: { Query: QueryBooksSdk, Mutation: MutationBooksSdk, Subscription: SubscriptionBooksSdk },
    };

export type MeshContext = BooksContext & BaseMeshContext;


import { getMesh } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { fileURLToPath } from '@graphql-mesh/utils';

const importedModules: Record<string, any> = {

};

const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn = (moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  if (!(relativeModuleId in importedModules)) {
    throw new Error(`Cannot find module '${relativeModuleId}'.`);
  }
  return Promise.resolve(importedModules[relativeModuleId]);
};

const rootStore = new MeshStore('.mesh', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: 'ts',
}), {
  readonly: true,
  validate: false
});


                import { findAndParseConfig } from '@graphql-mesh/cli';
                function getMeshOptions() {
                  console.warn('WARNING: These artifacts are built for development mode. Please run "mesh build" to build production artifacts');
                  return findAndParseConfig({
                    dir: baseDir,
                    artifactsDir: ".mesh",
                    configName: "mesh",
                    additionalPackagePrefixes: [],
                  });
                }
              

export const documentsInSDL = /*#__PURE__*/ [];

export async function getBuiltMesh(): Promise<MeshInstance<MeshContext>> {
  const meshConfig = await getMeshOptions();
  return getMesh<MeshContext>(meshConfig);
}

export async function getMeshSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const { sdkRequesterFactory } = await getBuiltMesh();
  return getSdk<TOperationContext>(sdkRequesterFactory(globalContext));
}

export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;