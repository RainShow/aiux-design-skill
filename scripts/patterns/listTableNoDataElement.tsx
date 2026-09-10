/**
 * 列表/详情 Arco `Table` 的 `noDataElement`，与页面级空态插画一致。
 * 表格内用 `inline`，不做页面级 1/4 顶距。详见 `PageLevelEmpty` / `empty-state.md`。
 */
import { PageLevelEmpty } from '../components/PageLevelEmpty'

/** 表格无数据插画；固定 `layout="inline"`，禁止套页面级 1/4 顶距 */
export const LIST_TABLE_NO_DATA_ELEMENT = <PageLevelEmpty layout="inline" description="暂无数据" />
