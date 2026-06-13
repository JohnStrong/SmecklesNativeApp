class Either<L, R> {
    constructor(readonly _tag: 'left' | 'right', readonly _left?: L, readonly _right?: R) { }

    filter(predicate: (value: R) => boolean, error: L): Either<L, R> {
        if (this._tag === 'left') return this;
        return predicate(this._right as R) ? this : left(error);
    }

    onLeft(fn: (error: L) => void): Either<L, R> {
        if (this._tag === 'left') fn(this._left as L);
        return this;
    }

    onRight(fn: (value: R) => void): Either<L, R> {
        if (this._tag === 'right') fn(this._right as R);
        return this;
    }
}

export const right = <L, R>(value: R): Either<L, R> => new Either<L, R>('right', undefined, value);
export const left = <L, R>(error: L): Either<L, R> => new Either<L, R>('left', error, undefined);
