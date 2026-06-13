export type Either<L, R> = { tag: 'left'; error: L} | {tag: 'right'; value: R}

export const fold = <L, R, T>(
    either: Either<L, R>,
    onLeft: (error: L) => T,
    onRight: (value: R) => T
): T => either.tag == 'left' ? onLeft(either.error) : onRight(either.value);
