/**
 * 预置导航图标（语义 → SVG）。
 * 写 `navConfig` 时先 `resolveNavIcon(菜单名)` 或查 `NAV_PRESET_ICONS`；命中则用本表，不要新画、不要换 Arco Icon。
 * 相对路径按落地深度：`../assets/nav`（物理文件在 Skill 根 `assets/`）。
 */
import fold from '../assets/nav/shell/fold.svg'
import unfold from '../assets/nav/shell/unfold.svg'
import putaway from '../assets/nav/shell/putaway.svg'
import iconFile from '../assets/nav/shell/icon-file.svg'
import iconNotification from '../assets/nav/shell/icon-notification.svg'

import railHome from '../assets/nav/rail/home.svg'
import railShare from '../assets/nav/rail/share.svg'
import railIntegrate from '../assets/nav/rail/integrate.svg'
import railEngineering from '../assets/nav/rail/engineering.svg'
import railMetadata from '../assets/nav/rail/metadata.svg'
import railGovernance from '../assets/nav/rail/governance.svg'
import railSecurity from '../assets/nav/rail/security.svg'
import railService from '../assets/nav/rail/service.svg'
import railOps from '../assets/nav/rail/ops.svg'

import groupDataConnection from '../assets/nav/group/data-connection.svg'
import groupDataTransfer from '../assets/nav/group/data-transfer.svg'
import groupIntegrationOps from '../assets/nav/group/integration-ops.svg'
import groupSingleNodeDev from '../assets/nav/group/single-node-dev.svg'
import groupPyspark from '../assets/nav/group/pyspark.svg'
import groupWorkflow from '../assets/nav/group/workflow.svg'
import groupNotebook from '../assets/nav/group/notebook.svg'
import groupDataAnnotation from '../assets/nav/group/data-annotation.svg'
import groupShareMarket from '../assets/nav/group/share-market.svg'
import groupShareAsset from '../assets/nav/group/share-asset.svg'
import groupShareSupplyDemand from '../assets/nav/group/share-supply-demand.svg'
import groupShareDelivery from '../assets/nav/group/share-delivery.svg'
import groupMetadataCatalog from '../assets/nav/group/metadata-catalog.svg'
import groupMetadataManage from '../assets/nav/group/metadata-manage.svg'
import groupDataGraph from '../assets/nav/group/data-graph.svg'
import groupGovernArchitecture from '../assets/nav/group/govern-architecture.svg'
import groupGovernStandard from '../assets/nav/group/govern-standard.svg'
import groupGovernModel from '../assets/nav/group/govern-model.svg'
import groupGovernQuality from '../assets/nav/group/govern-quality.svg'
import groupServiceApi from '../assets/nav/group/service-api.svg'
import groupDataWeaving from '../assets/nav/group/data-weaving.svg'
import groupMetricManage from '../assets/nav/group/metric-manage.svg'
import groupSecurityClassify from '../assets/nav/group/security-classify.svg'
import groupSecurityEncrypt from '../assets/nav/group/security-encrypt.svg'
import groupSecurityLifecycle from '../assets/nav/group/security-lifecycle.svg'
import groupSecurityWatermark from '../assets/nav/group/security-watermark.svg'
import groupSecurityPermission from '../assets/nav/group/security-permission.svg'
import groupSecurityKeyword from '../assets/nav/group/security-keyword.svg'
import groupOpsStat from '../assets/nav/group/ops-stat.svg'
import groupOpsCluster from '../assets/nav/group/ops-cluster.svg'
import groupOpsSchedule from '../assets/nav/group/ops-schedule.svg'
import groupOpsWarning from '../assets/nav/group/ops-warning.svg'

import appSquare from '../assets/nav/app-dev/app-square.svg'
import appComponentSquare from '../assets/nav/app-dev/component-square.svg'
import appAgent from '../assets/nav/app-dev/agent.svg'
import appObservation from '../assets/nav/app-dev/app-observation.svg'
import appMcpManage from '../assets/nav/app-dev/mcp-manage.svg'
import appPluginManage from '../assets/nav/app-dev/plugin-manage.svg'
import appWorkflow from '../assets/nav/app-dev/workflow.svg'
import appKnowledgeBase from '../assets/nav/app-dev/knowledge-base.svg'
import appDatabase from '../assets/nav/app-dev/database.svg'
import appTerminology from '../assets/nav/app-dev/terminology.svg'
import appServiceMonitor from '../assets/nav/app-dev/service-monitor.svg'
import appTagManage from '../assets/nav/app-dev/tag-manage.svg'
import appApiKeyManage from '../assets/nav/app-dev/api-key-manage.svg'
import appProtectionTask from '../assets/nav/app-dev/protection-task.svg'
import appKeywordLibrary from '../assets/nav/app-dev/keyword-library.svg'

import modelSquare from '../assets/nav/model-dev/model-square.svg'
import modelMyDataset from '../assets/nav/model-dev/my-dataset.svg'
import modelLlmTraining from '../assets/nav/model-dev/llm-training.svg'
import modelNotebook from '../assets/nav/model-dev/notebook-modeling.svg'
import modelJob from '../assets/nav/model-dev/job-modeling.svg'
import modelVisual from '../assets/nav/model-dev/visual-modeling.svg'
import modelMyModel from '../assets/nav/model-dev/my-model.svg'
import modelEvaluation from '../assets/nav/model-dev/model-evaluation.svg'
import modelEvalStrategy from '../assets/nav/model-dev/evaluation-strategy.svg'
import modelOnlineService from '../assets/nav/model-dev/online-service.svg'
import modelStressTest from '../assets/nav/model-dev/service-stress-test.svg'
import modelMyMirror from '../assets/nav/model-dev/my-mirror.svg'
import modelFileManage from '../assets/nav/model-dev/file-manage.svg'
import modelApiKey from '../assets/nav/model-dev/api-key-manage.svg'
import modelProtection from '../assets/nav/model-dev/protection-task.svg'
import modelKeyword from '../assets/nav/model-dev/keyword-library.svg'
import modelQaLibrary from '../assets/nav/model-dev/qa-library.svg'
import modelDataSquare from '../assets/nav/model-dev/data-square.svg'
import modelCaseSquare from '../assets/nav/model-dev/case-square.svg'
import modelMirrorSquare from '../assets/nav/model-dev/mirror-square.svg'
import modelMirrorManage from '../assets/nav/model-dev/mirror-manage.svg'
import modelOrgManage from '../assets/nav/model-dev/org-manage.svg'
import modelUserManage from '../assets/nav/model-dev/user-manage.svg'
import modelResourcePool from '../assets/nav/model-dev/resource-pool.svg'
import modelStorageManage from '../assets/nav/model-dev/storage-manage.svg'

import ontoHome from '../assets/nav/ontology/home.svg'
import ontoLibrary from '../assets/nav/ontology/ontology-library.svg'
import ontoModeling from '../assets/nav/ontology/modeling.svg'
import ontoDataSource from '../assets/nav/ontology/data-source.svg'
import ontoDataProcessing from '../assets/nav/ontology/data-processing.svg'
import ontoProcessingTask from '../assets/nav/ontology/processing-task.svg'
import ontoDataCatalog from '../assets/nav/ontology/data-catalog.svg'
import ontoNavA from '../assets/nav/ontology/nav-icon-a.svg'
import ontoNavB from '../assets/nav/ontology/nav-icon-b.svg'

import platWorkspace from '../assets/nav/platform/workspace.svg'
import platOrgManage from '../assets/nav/platform/org-manage.svg'
import platUserManage from '../assets/nav/platform/user-manage.svg'
import platUserGroup from '../assets/nav/platform/user-group-manage.svg'
import platRoleManage from '../assets/nav/platform/role-manage.svg'
import platClusterMonitor from '../assets/nav/platform/cluster-monitor.svg'
import platComponentMonitor from '../assets/nav/platform/component-monitor.svg'
import platAlarmStrategy from '../assets/nav/platform/alarm-strategy.svg'
import platAlarmHistory from '../assets/nav/platform/alarm-history.svg'
import platResourcePool from '../assets/nav/platform/resource-pool.svg'
import platStorageVolume from '../assets/nav/platform/storage-volume.svg'
import platAudit from '../assets/nav/platform/audit-operation.svg'

/**
 * 菜单中文名 / 壳控件名 → 预置 SVG。键与常见侧导文案对齐，便于语义匹配。
 */
export const NAV_PRESET_ICONS = {
  主页: railHome,
  数据共享: railShare,
  数据集成: railIntegrate,
  数据工程: railEngineering,
  元数据: railMetadata,
  数据治理: railGovernance,
  数据安全: railSecurity,
  数据服务: railService,
  运维管控: railOps,

  数据连接: groupDataConnection,
  数据传输: groupDataTransfer,
  集成运维: groupIntegrationOps,
  数据开发: groupSingleNodeDev,
  Pyspark开发: groupPyspark,
  工作流: groupWorkflow,
  开发笔记本: groupNotebook,
  数据标注: groupDataAnnotation,
  数据市场: groupShareMarket,
  数据资产: groupShareAsset,
  供需对接: groupShareSupplyDemand,
  数据共享交付: groupShareDelivery,
  元数据目录: groupMetadataCatalog,
  元数据管理: groupMetadataManage,
  数据图谱: groupDataGraph,
  数据架构: groupGovernArchitecture,
  数据标准: groupGovernStandard,
  数据模型: groupGovernModel,
  数据质量: groupGovernQuality,
  数据服务API: groupServiceApi,
  数据编织: groupDataWeaving,
  指标管理: groupMetricManage,
  分类分级: groupSecurityClassify,
  加密脱敏: groupSecurityEncrypt,
  数据全生命周期: groupSecurityLifecycle,
  数据水印: groupSecurityWatermark,
  数据权限: groupSecurityPermission,
  关键词防护: groupSecurityKeyword,
  运维总览: groupOpsStat,
  集群资源: groupOpsCluster,
  任务调度: groupOpsSchedule,
  任务预警: groupOpsWarning,

  应用广场: appSquare,
  组件广场: appComponentSquare,
  智能体: appAgent,
  应用观测: appObservation,
  MCP管理: appMcpManage,
  插件管理: appPluginManage,
  应用工作流: appWorkflow,
  知识库: appKnowledgeBase,
  数据库: appDatabase,
  术语库: appTerminology,
  服务监控: appServiceMonitor,
  标签管理: appTagManage,
  'API Key管理': appApiKeyManage,
  防护任务: appProtectionTask,
  关键词库: appKeywordLibrary,

  模型广场: modelSquare,
  我的数据集: modelMyDataset,
  大模型训练: modelLlmTraining,
  Notebook建模: modelNotebook,
  作业建模: modelJob,
  可视化建模: modelVisual,
  我的模型: modelMyModel,
  模型评估: modelEvaluation,
  评估策略: modelEvalStrategy,
  在线服务: modelOnlineService,
  服务压测: modelStressTest,
  我的镜像: modelMyMirror,
  文件管理: modelFileManage,
  模型APIKey: modelApiKey,
  模型防护任务: modelProtection,
  模型关键词库: modelKeyword,
  问答库: modelQaLibrary,
  数据广场: modelDataSquare,
  案例广场: modelCaseSquare,
  镜像广场: modelMirrorSquare,
  镜像管理: modelMirrorManage,
  模型组织管理: modelOrgManage,
  模型用户管理: modelUserManage,
  模型资源池: modelResourcePool,
  存储管理: modelStorageManage,

  本体主页: ontoHome,
  本体库: ontoLibrary,
  手动建模: ontoModeling,
  本体数据源: ontoDataSource,
  数据加工: ontoDataProcessing,
  加工任务: ontoProcessingTask,
  数据目录: ontoDataCatalog,
  本体规则: ontoNavA,
  本体分析: ontoNavB,

  工作空间: platWorkspace,
  组织管理: platOrgManage,
  用户管理: platUserManage,
  用户组管理: platUserGroup,
  角色管理: platRoleManage,
  集群监控: platClusterMonitor,
  组件监控: platComponentMonitor,
  告警策略: platAlarmStrategy,
  告警历史: platAlarmHistory,
  资源池管理: platResourcePool,
  存储卷管理: platStorageVolume,
  操作记录: platAudit,

  功能全景: putaway,
  侧栏折叠: fold,
  侧栏展开: unfold,
  顶栏文档: iconFile,
  顶栏消息: iconNotification,
} as const

export type NavPresetIconName = keyof typeof NAV_PRESET_ICONS

/**
 * 常见别名 → 正式键。`resolveNavIcon` 会先精确匹配正式键，再走本表。
 */
export const NAV_ICON_ALIASES: Record<string, NavPresetIconName> = {
  首页: '主页',
  Home: '主页',
  共享: '数据共享',
  集成: '数据集成',
  工程: '数据工程',
  治理: '数据治理',
  安全: '数据安全',
  服务: '数据服务',
  运维: '运维管控',
  数据源: '数据连接',
  数据源管理: '数据连接',
  添加数据源: '数据连接',
  服务管理: '数据服务API',
  资产目录: '数据资产',
  我的需求: '供需对接',
  开发任务: '数据开发',
  开发资源: '数据开发',
  标注需求: '数据标注',
  质量规则: '数据质量',
  标准管理: '数据标准',
  概念模型: '数据模型',
  逻辑模型: '数据模型',
  物理模型: '数据模型',
  汉堡: '功能全景',
  全览: '功能全景',
  折叠: '侧栏折叠',
  展开: '侧栏展开',
  文档: '顶栏文档',
  消息: '顶栏消息',
  消息通知: '顶栏消息',
  Agent: '智能体',
  工作流编排: '工作流',
  AI建模: '手动建模',
  IDE建模: '手动建模',
  权限管理: '数据权限',
  规则管理: '本体规则',
}

/**
 * 按菜单文案取预置图标。未命中返回 `undefined`，此时才允许补新 SVG 并登记到本表。
 */
export function resolveNavIcon(hint: string): string | undefined {
  const key = hint.trim()
  if (!key) return undefined
  if (Object.prototype.hasOwnProperty.call(NAV_PRESET_ICONS, key)) {
    return NAV_PRESET_ICONS[key as NavPresetIconName]
  }
  const aliased = NAV_ICON_ALIASES[key]
  return aliased ? NAV_PRESET_ICONS[aliased] : undefined
}
