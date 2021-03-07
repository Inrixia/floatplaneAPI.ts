export type Image = {
	width: number,
	height: number,
	path: string,
	childImages: ChildImage[]
}

export type ChildImage = { width: number, height: number, path: string }