import { ValueOf, ValueOfA } from "@inrixia/helpers/ts";

type Constructor = abstract new (...args: any) => any;

declare global {
	type Primitive<T> = T extends String
		? string
		: T extends StringConstructor
		? string
		: T extends Number
		? number
		: T extends NumberConstructor
		? number
		: T extends Boolean
		? boolean
		: T extends BooleanConstructor
		? boolean
		: T;
	namespace Vi {
		interface ExpectStatic extends Chai.ExpectStatic, AsymmetricMatchersContaining {
			any<C>(constructor: C extends Constructor ? C : any): C extends Constructor ? Primitive<InstanceType<C>> : C;
		}
		interface AsymmetricMatchersContaining {
			arrayContaining<T = unknown>(expected: Array<T>): T[];
			objectContaining<T = unknown>(expected: T): T;
			stringMatching<T extends string>(expected: T): T;
		}
	}
}
