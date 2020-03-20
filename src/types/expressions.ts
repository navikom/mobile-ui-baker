export type GreaterThanType = "greater than";
export type LessThanType = "less than";
export type EqualType = "equal to";
export type DoesNotEqualType = "does not equal to";
export type IsGreaterThanOrEqualType = "is greater than or equal to";
export type IsLessThanOrEqualType = "is less than or equal to";
export type AtLeastOnceType = "at least once";
export type NotOnceType = "not once";
export type OnceType = "once";
export type BetweenType = "between";
export type NotBetweenType = "not between";
export type EmptyType = "is empty";
export type IsNotEmptyType = "is not empty";
export type OneOfType = "one of";
export type NoneOneOfType = "none one of";
export type AndType = "and";
export type OrType = "or";
export type StartsWithType = "starts with";
export type DoesNotStartWithType = "does not start with";
export type EndsWithType = "ends with";
export type DoesNotEndWithType = "does not end with";
export type ContainsType = "contains";
export type BeforeType = "before";
export type AfterType = "after";
export type WithingType = "withing";
export type IncludeType = "include";
export type ExcludeType = "exclude";

export type NumberTypes =
  | GreaterThanType
  | LessThanType
  | EqualType
  | DoesNotEqualType
  | IsGreaterThanOrEqualType
  | IsLessThanOrEqualType
  | BetweenType
  | NotBetweenType
  | OneOfType
  | NoneOneOfType
  | EmptyType
  | IsNotEmptyType;

export type NumberExpressionTypesArray = [
  GreaterThanType,
  LessThanType,
  EqualType,
  DoesNotEqualType,
  IsGreaterThanOrEqualType,
  IsLessThanOrEqualType,
  BetweenType,
  NotBetweenType,
  OneOfType,
  NoneOneOfType,
  EmptyType,
  IsNotEmptyType
];

export type DateTypes = BeforeType | AfterType | WithingType;

export type DateExpressionTypesArray = [BeforeType, AfterType, WithingType];

export type IncludingExpressionTypesArray = [IncludeType, ExcludeType];

export type StringTypes =
  | EqualType
  | DoesNotEqualType
  | OneOfType
  | NoneOneOfType
  | EndsWithType
  | DoesNotEndWithType
  | StartsWithType
  | DoesNotStartWithType
  | ContainsType
  | EmptyType
  | IsNotEmptyType;

export type StringExpressionTypesArray = [
  EqualType,
  DoesNotEqualType,
  OneOfType,
  NoneOneOfType,
  EndsWithType,
  DoesNotEndWithType,
  StartsWithType,
  DoesNotStartWithType,
  ContainsType,
  EmptyType,
  IsNotEmptyType
];

export type ValueType =
  | "value"
  | "values"
  | "date"
  | "min"
  | "max"
  | "from"
  | "to";

export type ExpressionValueType = {
  key?: ValueType;
  keys?: ValueType[];
  defaultValue?: number | string | Date;
  defaultValues?: (number | Date)[];
};
