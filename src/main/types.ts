export type WithoutUrlField<Type> = {
	[Property in keyof Type as Exclude<Property, "url">]: Type[Property];
};

export type WithoutBodyField<Type> = {
	[Property in keyof Type as Exclude<Property, "body">]: Type[Property];
};
