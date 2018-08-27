/**
 * 所有前台数据请求跳转后台接口
 */
/*登录*/
var submitLoginFormUrl = 'loginController/login';
var submitServiceLoginFormUrl = 'serviceLoginController/serLogin';

//移动端登录
var appLoginFormUrl = 'appLoginController/serLogin';
/* 检测登录状态 */
var checkSignInStatusUrl = 'staticCheck/checkSignInStatus';

var fileUrl = "resourceAddHelp/uploadFile";
/*加载资产图表数据部分（dashboard页面）*/
var classifyUrl = 'resourceAjax/classfiy';
var lashThirtyUrl = 'resourceAjax/lastThirtyData';

/*加载资产图表数据部分（资产列表球体统计图）*/
var resourceClassifyCountsUrl = 'resourceAjax/resourceClassifyCount';
/*加载资产图表数据部分（资产列表数据）*/
var showResourceListUrl ='resourceAjax/showResourceList';
/*加载资产图表数据部分（资产动态柱状图）*/
var getResTrendsDataUrl='resourceAjax/getResTrendsData';

/*资产列表按钮操作部分*/
var res_deleteUrl = 'resourceAjax/deleteResource';
var res_setDeptUrl = 'resourceAjax/setDepartment';
var res_changeStateUrl = 'resourceAjax/changeResState';
var res_depreciatedUrl = 'resourceAjax/depreciated';
var res_connContractUrl = 'resourceAjax/connContract';
var departmentDataUrl = 'resourceAjax/departmentData';
var getContractsUrl = 'resourceAjax/getContractsData';
var loadResourceEventUrl = 'resourceAjax/loadResourceEvent'

var loadCategoryModelUrl = 'resourceAddHelp/loadCategoryModel';
var loadResourceHelpUrl = 'resourceAddHelp/loadResourceHelp';
var checkFileNameUrl = 'resourceAddHelp/checkFileName';
var resourceAddUrl = 'resourceAjax/resourceAdd';
var loadCategoryTreeUrl = 'resourceAddHelp/loadCategoryTree';
var loadCategoryZTreeUrl = 'resourceAddHelp/loadCategoryZTree';
var loadContractDeadLineUrl = 'resourceAddHelp/loadContractDeadLine';
/*新增品牌接口*/
var createBrandSymBolUrl = 'resourceAjax/createBrandSymBol';
/*企业查询品牌信息*/
var loadBrandListUrl = 'resourceAjax/loadBrandList';
/*创建品牌型号信息*/
var createBrandModelUrl = 'resourceAjax/createBrandModel';

/*资产详情页面操作*/
var getClassifyDataUrl = 'resourceAjax/getClassifyData';
var res_moveClassifyUrl = 'resourceAjax/res_moveClassify'
var resourceDetailUrl = 'resourceAjax/resourceDetail';
var resFileUrlUpdateUrl = 'resourceAjax/resFileUrlUpdate';
var resourceUpdateUrl = 'resourceAjax/resourceUpdate';
var updateMainResInfoUrl = 'resourceAjax/updateMainResInfo';
var updateResListInfoUrl = 'resourceAjax/updateResListInfo';
var putContractUrl = 'resourceAddHelp/putContract';
var loadResEventBollUrl = 'resourceAjax/loadResEventBoll';

/*项目*/
var projectAddUrl = 'project/projectAdd';
var projectDetailUrl = 'project/projectDetail';
var projectListUrl = 'project/projectList';
var projectUpdateUrl = 'project/projectUpdate';
var projectRecycleUrl = 'project/projectRecycle';
var loadProContractUrl = 'project/loadProContract';
var loadContractNoProUrl = 'project/loadContractNoPro';
var deleteProConUrl = 'project/deleteProCon';
var linkProConUrl = 'project/linkProCon';
var updateProjectFileUrl = 'project/updateProjectFile';
/* 事件 */
var eventShowListUrl = 'event/showList';
var eventAddtUrl = 'event/add';
var eventUpdatetUrl = 'event/update';
var eventUpdateFileUrl = 'event/updateFileUrl';
var eventDetailUrl = 'event/detail';
var eventDeleteUrl = 'event/delete';
var eventTogetherUrl = 'event/together';
var eventToManager = 'event/toManager';
var eventCloseUrl = 'event/close';
var eventReplyUrl = 'event/reply';
var loadManagerUrl = 'event/loadManager';
var loadManagerNoSelfUrl = 'event/loadManagerNoSelf';
var loadAskerUrl = 'event/loadAsker';
var loadOtherEventUrl = 'event/loadOtherEvent';
var loadServiceUrl = 'event/loadService';
var publishUrl = 'event/publish';
var checkUrl = 'event/check';
var conversationUrl = 'event/conversation';
var loadCurrentUserUrl = 'event/loadCurrentUser';
var dblDetailUrl = 'event/dblDetail';
var eWorkOrderUrl = 'event/workOrder';
var loadResourceUrl = 'event/loadResource';
var resEventUrl = 'event/resEvent';
var resEventDeleteUrl = 'event/resEventDelete';
var eventIdsUrl = 'event/eventIds';
var conversationUpdateUrl = 'event/conversationUpdate';
var conversationDeleteUrl = 'event/conversationDelete';
var eventStatisticsUrl = 'event/eventStatistics';
var eventStatisticsByStatusUrl = 'event/eventStatisticsByStatus';

/*供应商*/
	var loadSuppliersAllUrl = 'suppliers/loadSuppliersAll';
	var supplierAddUrl = 'suppliers/supplierAdd';
	var getSuppliesInfoListUrl = 'suppliers/getSuppliesInfoList';
	/*根据企业ID查询该企业下所有供应商列表信息*/
	var getSuppliesInfoListUrl = 'suppliers/getSuppliesInfoList';
	/*获取所有城市信息*/
	var getAllCityInfoUrl = 'suppliers/getAllCityInfo';
	/*获取省（二级）城市列表信息*/
	var getCityInfoUrl = 'suppliers/getCityInfo';
	/*删除供应商*/
	var deleteSupplierUrl = 'suppliers/deleteSupplier';
	/*查询供应商详情*/
	var getSupplyDetailsUrl = 'suppliers/getSupplyDetails';
	/*新增供应商数据*/
	var addSuppliersInfoUrl = 'suppliers/addSuppliersInfo';
	/*（编辑）修改供应商*/
	var updateSupplierInfoUrl = 'suppliers/updateSupplierInfo';
	/*签署合同列表信息*/
	var getSupplyContractListUrl = 'suppliers/getSupplyContractList';
	
/*注册*/
var registerCheckUrl = 'register/registerCheck';
var registerAjaxUrl = 'register/registerAjax';
var registerSerUrl = 'register/registerAjaxSer';
var registerSerCheckUrl = 'register/registerSerCheck';
/* 合同列表管理 */
var loadContractDataUrl = 'contract/loadContractData';
var loadFirmNameUrl = 'contract/loadFirmName'
var contractDeleteUrl = 'contract/contractDelete';
/* 合同详情管理 */
var loadContractDetailUrl = 'contract/loadContractDetailInfo';
var loadResListOfTheContractUrl = 'contract/loadResListOfTheContract';
var contractResDelUrl = 'contract/contractResDel';
var loadResListExceptUrl = 'contract/loadResListExcept';
var addResToContractUrl = 'contract/addResToContract';
var updateConFileUrl = 'contract/updateConFile';
/* 新建合同 */
var loadConFirmInfoUrl = 'contract/loadConFirmInfo';
var contractCreateUrl = 'contract/contractCreate';
var loadConServiceUrl = 'contract/loadConService';
var loadSLAInfoUrl = 'contract/loadSLAInfo';
/*修改合同*/
var contractUpdateInfoUrl = 'contract/contractUpdateInfo';
/*合同提交审阅*/
var conCheckUrl = 'contract/conCheck';
/*合同审阅结果*/
var conCheckResultUrl = 'contract/conCheckResult';
/*合同撤回*/
var conRevokeUrl = 'contract/conRevoke';
/*删除附件*/
var deleteFileUrl = 'contract/deleteFile';

/* 服务商工单管理 */
var loadWorkOrderDataUrl = 'workOrder/loadWorkOrderData';
var searchSerIdByInsertUrl = 'workOrder/searchSerIdByInsert'
var orderBackSaveUrl = 'workOrder/orderBackSave';
var orderAcceptSaveUrl = 'workOrder/orderAcceptSave';
var loadServiceMembersUrl = 'workOrder/loadServiceMembers';
var submitInnerWorkOrderUrl = 'workOrder/submitInnerWorkOrder';
var submitOutWorkOrderUrl = 'workOrder/submitOutWorkOrder';
/* 工单详情页面操作请求 */
var loadWorkOrderDetailUrl = 'workOrder/loadWorkOrderDetail';
var workOrderDispatchUrl = 'workOrder/workOrderDispatch';
var workOrderDispatchOrBackUrl = 'workOrder/workOrderDispatchOrBack';
var loadOrderWorkLogUrl = 'workOrder/loadOrderWorkLog';
var changeOrderBackUrl = 'workOrder/changeOrderBack';
var addWorkLogUrl = 'workOrder/addWorkLog';
var delWorkOrderLogUrl = 'workOrder/delWorkOrderLog';
var loadWorkLogByIdUrl = 'workOrder/loadWorkLogById';
var editOrderLogSaveUrl = 'workOrder/editOrderLogSave';
var getPersonNameUrl = 'workOrder/getPersonName';
/*工作日志改版后接口*/
	/*添加工作日志*/
	var newAddOrderWorkLogsUrl = 'workOrder/newAddOrderWorkLogs';
	/*编辑修改工作日志*/
	var newEditOrderLogSaveUrl = 'workOrder/newEditOrderLogSave';
	
/*解决方案*/
	/*创建解决方案*/
	var createSolutionUrl = 'workOrder/createSolution';
	/*加载详情解决方案*/
	var getSolutionDetailUrl ='workOrder/getSolutionDetail';
	/*修改解决方案*/
	var updateSolutionUrl = 'workOrder/updateSolution';
	/*解决方案提交知识库*/
	var submitKnowledgeBaseUrl = 'workOrder/submitKnowledgeBase';
	/*加载解决方案列表*/
	var loadSolutionsOfEventUrl = 'workOrder/loadSolutionsOfEvent';

/* 服务商合同管理 */
var loadServiceContractDataUrl ='serviceContract/loadServiceContractData'
var loadEnterpriseNameListUrl ='serviceContract/loadEnterpriseNameList';
var loadServiceSLAInfoUrl ='serviceContract/loadServiceSLAInfo';
var loadServiceEmployeesUrl ='serviceContract/loadServiceEmployees';
var createOperationGroupConfirmUrl ='serviceContract/createOperationGroupConfirm';
var changeContractSLAUrl ='serviceContract/changeContractSLA';
var searchOperationGroupUrl ='serviceContract/searchOperationGroup';
var delOperationGroupMemberUrl ='serviceContract/delOperationGroupMember';

/* SLA管理 */
var loadSLAListUrl = 'SLAManager/loadSLAList';
var openOrCloseSLAUrl= 'SLAManager/openOrCloseSLA';
var removeSLAtoRecycleUrl ='SLAManager/removeSLAtoRecycle';
var createSLAAgreementUrl = 'SLAManager/createSLAAgreement';
var loadSLADetailUrl = 'SLAManager/loadSLADetail';
var slaUpdateInfoUrl = 'SLAManager/slaUpdateInfo';
var updateSlaFileUrl = 'SLAManager/updateSlaFile';

/*配置文件*/
var loadPageEachNumUrl = 'LoadConstants/loadPageEachNum';
var loadPageEachNumPCUrl = 'LoadConstants/loadPageEachNumPC';
var loadPageEachNumREUrl = 'LoadConstants/loadPageEachNumRE';

/*历史纪录*/
var getHistoricalInfoUrl='historical/gethistoricalinfo';

/*服务商工作台接口*/
	/* 查询“已逾期”工单统计接口*/
	var loadOverdueOrderListUrl = 'serviceDashboard/loadOverdueOrderList';
	/*查询最近7天待处理切未逾期的工单*/
	var loadLastSevenDayOrderListUrl = 'serviceDashboard/loadLastSevenDayOrderList';
	/*工单执行情况加载*/
	var loadExecuteOrderDataUrl = 'serviceDashboard/loadExecuteOrderData';
	/*加载该用户所有工单的统计数据，显示总工单数量*/
	var loadOrderStatisticsDataUrl = 'serviceDashboard/loadOrderStatisticsData';
	/*加载当前用户可见的所有工单统计信息*/
	var loadOrderCountDataUrl = 'serviceDashboard/loadOrderCountData';
	/*加载当前用户可见的所有已关闭工单的逾期情况*/
	var loadClosedOrderOverdueSolutionUrl = 'serviceDashboard/loadClosedOrderOverdueSolution';
	/*加载当前用户可见的所有已关闭工单的解决情况*/
	var loadClosedOrderSolvedSolutionUrl = 'serviceDashboard/loadClosedOrderSolvedSolution';

/*企业账号管理类*/
	/*获取企业所有用户信息*/
	var getUserInfoListUrl = 'userManagerController/getUserInfoList';
	/*创建企业员工使用账号（用户）*/
	var createUserAccountUrl = 'userManagerController/createUserAccount';
	/*用户信息编辑*/
	var updateUserInfo = 'userManagerController/updateUserInfo';
	/*用户修改密码*/
	var updatePasswordUrl = 'userManagerController/updatePassword';
	/*企业账号冻结*/
	var freezeAccountUrl = 'userManagerController/freezeAccount';

/*服务商账号和人员管理*/
	/*创建新人员并分配员工账号*/
	var createAccountPersonUrl = 'serviceAccountPerson/createAccountPerson';

/*员工管理类(服务商/企业：通用)*/
	/*加载员工管理列表页信息*/
	var loadPersonManagerListUrl = 'personManager/loadPersonManagerList';
	/*创建新员工*/
	var createNewEmployeeUrl = 'personManager/createNewEmployee';
	/*员工信息编辑修改保存*/
	var updateEmployeeUrl = 'personManager/updateEmployee';
	/*根据员工ID查询员工详情信息*/
	var loadEmployeeDetailUrl = 'personManager/loadEmployeeDetail';
	/*删除员工（冻结）*/
	var freezeEmployeeUrl = 'personManager/freezeEmployee';
	/*员工账号注销（此接口仅限于企业）*/
	var logoutEmployeeUrl = 'personManager/logoutEmployee';
	/*注册员工账号（此接口仅限于企业）*/
	var registerEmployeeAccoutUrl = 'personManager/registerEmployeeAccout';
	
/*部门管理*/
	/*加载该企业部门信息列表*/
	var loadDepartmentListUrl = 'departmentNewestManager/loadDepartmentList';
	/*根据部门ID加载部门详情信息*/
	var loadDepartmentDetailUrl = 'departmentNewestManager/loadDepartmentDetail';
	/*新增部门（同新增子部门）*/
	var createDepartmentNewUrl = 'departmentNewestManager/createDepartmentNew';
	/*修改部门信息*/
	var updateDepartmentNewUrl = 'departmentNewestManager/updateDepartmentNew';
	/*删除部门*/
	var deleteDepartmentNewUrl = 'departmentNewestManager/deleteDepartmentNew';

/*企业基本信息管理*/
	/*查询企业基本信息*/
	var getEnterpriseInfoUrl = 'enterpriseInfoManager/getEnterpriseInfo';
	/*修改企业基本信息*/
	var updateEnterpriseInfoUrl = 'enterpriseInfoManager/updateEnterpriseInfo';
	/*加载企业登记人基本信息*/
	var getRegisterPersonInfoUrl = 'enterpriseInfoManager/getRegisterPersonInfo';
	/*修改企业登记人基本信息*/
	var updateBusinesInfoUrl = 'enterpriseInfoManager/updateBusinesInfo';
/*权限管理*/
	/*加载系统角色*/
	var loadSystemRoles='roleManagerController/loadRoleList';
	/*创建新角色*/
	var createRoles='roleManagerController/createRole';
