export class Status {
  title?: string
  level?: number
  color?: string

  constructor(color?: string, title?: string, level?: number) {
    this.title = title
    this.level = level
    this.color = color
  }
}
