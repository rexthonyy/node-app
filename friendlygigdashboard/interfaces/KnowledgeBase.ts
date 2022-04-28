export interface knowledgeBase {
  id: number
  name?: string
  icon?: string
  footer?: string
  created_at?: string
  homepage_layout?: string
  category_layout?: string
  active?: boolean
  updated_at?: string
  front_page?: string
  position?: number
  ui_color?: string
  is_archived?: boolean
  tooltip?: string
  stat?: Stat
}

interface Stat {
  num_categories: number
}
