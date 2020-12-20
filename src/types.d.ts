export type Image = {
	width: number,
	height: number,
	path: string,
	childImages: Array<{ width: number, height: number, path: string }>
}