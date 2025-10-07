<%
var DEV_MODE = customWebTemplate.access.enable_anonymous_access;
if (DEV_MODE) {
  // Для тестирования, шаблон должен быть анонимным.
  Request.AddRespHeader("Access-Control-Allow-Origin", "*", false);
  Request.AddRespHeader("Access-Control-Expose-Headers", "Error-Message");
  Request.AddRespHeader("Access-Control-Allow-Headers", "origin, content-type, accept");
  Request.AddRespHeader("Access-Control-Allow-Credentials", "true");
}
Request.RespContentType = "application/json";
Request.AddRespHeader("Content-Security-Policy", "frame-ancestors 'self'");
Request.AddRespHeader("X-XSS-Protection", "1");
Request.AddRespHeader("X-Frame-Options", "SAMEORIGIN");
/* --- utils --- */
function getParam(name) {
  return tools_web.get_web_param(curParams, name, undefined, 0);
}
/*
* Выбирает все записи sql запроса
* @param {string} query - sql-выражение
*/
function selectAll(query) {
  return ArraySelectAll(tools.xquery("sql: " + query));
}
/*
* Выбирает первую запись sql запроса
* @param {string} query - sql-выражение
* @param {any} defaultObj - значение по умолчанию
*/
function selectOne(query, defaultObj) {
  if (defaultObj === void 0) { defaultObj = undefined; }
  return ArrayOptFirstElem(tools.xquery("sql: " + query), defaultObj);
}
/**
* Создает поток ошибки с объектом error
* @param {object} errorObject - объект ошибки
*/
function HttpError(errorObject) {
  throw new Error(EncodeJson(errorObject));
}
/* --- global --- */
var curUserId = DEV_MODE
  ? OptInt("7079554317075315721") // id пользователя
  : OptInt(Request.Session.Env.curUserID);
var curUser = DEV_MODE ? tools.open_doc(curUserId).TopElem : Request.Session.Env.curUser;
/* --- logic --- */

var logConfig = {
  code: "tools_log",
  type: "tools",
  id: customWebTemplate.id
}

function log(message, type) {
  type = IsEmptyValue(type) ? "INFO" : StrUpperCase(type);

  if (ObjectType(message) === "JsObject" || ObjectType(message) === "JsArray" || ObjectType(message) === "XmLdsSeq" || ObjectType(message) === "XmElem") {
    message = tools.object_to_text(message, "json")
  }

  var log = "["+type+"]["+logConfig.type+"]["+logConfig.id+"]: "+message;

  if(DEV_MODE) {
    alert(log)
  } else {
    EnableLog(logConfig.code, true)
    LogEvent(logConfig.code, log);
    EnableLog(logConfig.code, false)
  }  
}

function checkUserRole() {
  var menuItems = []

  var accessTrainingManagement = getParam("accessTrainingManagementId");
  var acessRewardsUpdate = getParam("acessRewardsUpdateId");
  var accessMentorProfile = getParam("accessMentorProfileId");
  var groupManagement = getParam("groupManagement")
  var assignAdapt = getParam("adaptationGroup")

  var isAccessTrainingManagement = selectOne("SELECT * FROM group_collaborators gc WHERE gc.group_id = " + accessTrainingManagement + " AND collaborator_id = " + curUserId);
  
  if (isAccessTrainingManagement !== undefined) {
    menuItems.push(
      {
        id: 1,
        title: 'Назначение курсов и тестов',
        route: '/TrainingManagement'
      }
    )
  }

  var isGroupManagement = selectOne("SELECT * FROM group_collaborators gc WHERE gc.group_id = " + groupManagement + " AND collaborator_id = " + curUserId);

  if(isGroupManagement !== undefined) {
    menuItems.push(
      {
        id: 2,
        title: 'Управление группами',
        route: '/groupManagement'
      }
    )
  }

  var isAcessRewardsUpdate = selectOne("SELECT * FROM group_collaborators gc WHERE gc.group_id = " + acessRewardsUpdate + " AND collaborator_id = " + curUserId);  

  if (isAcessRewardsUpdate !== undefined) {
    menuItems.push(
      { id: 3, title: 'Обновление наград', route: '/RewardsUpdate' }
    )
  }

  var isAccessMentorProfile = selectOne("SELECT * FROM group_collaborators gc WHERE gc.group_id = " + accessMentorProfile + " AND collaborator_id = " + curUserId);  

  if (isAccessMentorProfile !== undefined) {
    menuItems.push(
      { id: 4, title: 'Обновление профилей наставников', route: '/MentorProfile' }
    )
  }

  var isAccessAssignAdapt = selectOne("SELECT * FROM group_collaborators gc WHERE gc.group_id = " + assignAdapt + " AND collaborator_id = " + curUserId);
  if (isAccessAssignAdapt !== undefined) {
    menuItems.push(
      { id: 5, title: 'Назначение адаптации', route: '/AssignAdapt' }
    )
  }

  return menuItems;
}

function findRightPerson(personData, resultObj, adaptMode) {
  var _query_str
  if(adaptMode === true) {
    _query_str = "SELECT * FROM collaborators WHERE fullname = " + XQueryLiteral(personData.fullname);
  } else {
    _query_str = "SELECT id, fullname, position_name, position_parent_name FROM collaborators WHERE fullname = " + XQueryLiteral(personData.fullname);
  }
  
  if (personData.position_name !== null) {
    _query_str += " AND position_name = " + XQueryLiteral(personData.position_name);
  }
  if (personData.position_parent_name !== null) {
    _query_str += " AND position_parent_name = " + XQueryLiteral(personData.position_parent_name);
  }

  _query_str += " AND (is_dismiss = 0 OR (is_dismiss = 1 AND dismiss_date IS NOT NULL AND dismiss_date >= DATEADD(month, -3, CAST(GETDATE() AS date))))";

  try {
    var receivedPersons = selectAll(_query_str);

    if (receivedPersons.length === 0) {
      resultObj.notFoundPersons.push(personData);
      return null;
    }

    if (receivedPersons.length > 1) {
      for (person in receivedPersons) {
        resultObj.dublicatePersons.push(person);
      }
      return null;
    }

    return receivedPersons[0];

  } catch (err) {
    log("Ошибка при выполнении запроса XQuery: " + err.message);
    return null;
  }
}

function getCourses() {
  var categoryCourseId = getParam("categoryCourseId")
  return selectAll("SELECT c.id, c.name, c.code, c.modification_date FROM courses c CROSS APPLY c.role_id.nodes('/role_id') AS R(x) WHERE R.x.value('.', 'varchar(50)') = '" + categoryCourseId + "'");
}
function getAssessments() {
  var categoryAssessmentsId = getParam("categoryAssessmentsId")
  return selectAll("SELECT id, code, title AS name, modification_date FROM assessments a CROSS APPLY a.role_id.nodes('/role_id') AS R(x) WHERE R.x.value('.', 'varchar(50)') = '" + categoryAssessmentsId + "'");
}
function getGroups() {
  var categoryGroupId = getParam("categoryGroupId")
  return selectAll("SELECT g.id, g.code, g.name, g.modification_date FROM groups g CROSS APPLY g.role_id.nodes('/role_id') AS R(x) WHERE R.x.value('.', 'varchar(50)') = '" + categoryGroupId + "'");
}
function getCollaborators(body) {
  var strQuery = body.search
  return selectAll("SELECT c.id, c.fullname, c.position_name, c.position_parent_name FROM collaborators c WHERE c.is_dismiss = '0' AND c.fullname LIKE '%" + strQuery + "%'")
}

function getPersonsGroup(body) {
  var groupId = body.id

  if(!groupId) {
    log("Айди группы неизвестно")
    return null
  }

  return selectAll("\
    SELECT\
      c.id,\
      c.fullname,\
      c.position_name,\
      c.position_parent_name\
    FROM\
      group_collaborators gc\
    LEFT JOIN\
      collaborators c\
    ON\
      c.id = gc.collaborator_id\
    WHERE\
      gc.group_id = '" + groupId + "'\
    ")
}

function assignCourses(body) {
  var selectedCourse = body.GetOptProperty("currentObj").id
  var excelData = body.excelObj
  var time = body.GetOptProperty("time") ? body.GetOptProperty("time") : 30

  var resultObj = {
    counterPersons: 0,
    notFoundPersons: [],
    dublicatePersons: [],
    prevAssign: []
  }

  for(var i = 0; i < excelData.length; i++) {
    rightPerson = findRightPerson(excelData[i], resultObj, false);

    if (rightPerson === null) {
      continue;
    }

    activeResultCourse = tools.activate_course_to_person(rightPerson.id, selectedCourse, null, null, null, time)

    if(OptInt(activeResultCourse, 0) !== 0) {
      resultObj.prevAssign.push(excelData[i])
      continue
    }

    resultObj.counterPersons++
  }
  return resultObj;
}
function assignAssessments(body) {
  var selectedTest = body.GetOptProperty("currentObj").id
  var excelData = body.excelObj
  var time = body.GetOptProperty("time") ? body.GetOptProperty("time") : 30

  var resultObj = {
    counterPersons: 0,
    notFoundPersons: [],
    dublicatePersons: [],
    prevAssign: []
  }

  for(var i = 0; i < excelData.length; i++) {
    rightPerson = findRightPerson(excelData[i], resultObj, false);

    if (rightPerson === null) {
      continue;
    }
    activeResultTest = tools.activate_test_to_person(rightPerson.id, selectedTest, null, null, null, null, time)

    if(OptInt(activeResultTest, 0) !== 0) {
      resultObj.prevAssign.push(excelData[i])
      continue
    }

    resultObj.counterPersons++
  }
  return resultObj;
}
function addToGroup(body) {
  var selectedGroup = OptInt(body.currentGroup.id)
  var selectedUser = body.selectedUser
  var excelData = body.excelObj

  var responseObj = {
    success: true,
    code: 201,
    message: "Все сотрудники успешно добавлены",
    counterPersons: 0,
    notFoundPersons: [],
    dublicatePersons: []
  }

  gr = tools.open_doc(selectedGroup)

  if(excelData.length > 0) {
    for(var i = 0; i < excelData.length; i++) {
      rightPerson = findRightPerson(excelData[i], responseObj, false);
  
      if (rightPerson === null) {
        continue;
      }
  
      gr.TopElem.collaborators.ObtainChildByKey(rightPerson.id);
      responseObj.counterPersons++
    }
  } else {
      gr.TopElem.collaborators.ObtainChildByKey(OptInt(selectedUser.id));
      responseObj.counterPersons++
  }

  gr.Save();

  if(responseObj.notFoundPersons.length > 0 || responseObj.dublicatePersons.length > 0) {
    responseObj.success = false
    responseObj.code = 101
    responseObj.message = "Добавлено " + responseObj.counterPersons + " сотрудников, есть ошибки"
  }

  return responseObj;
}
function deletePersonFromGroup(body) {
  var responseObj = {
    success: true,
    code: 200,
    message: "Все сотрудники успешно удалены",
    counterPersons: 0,
    notProcessed: []
  }
  try {
    var selectedGroup = OptInt(body.currentGroup.id)
    var personsArray = body.selectedUsers

    var groupDoc = tools.open_doc(selectedGroup)

    for(person in personsArray) {
      try {
        groupDoc.TopElem.collaborators.DeleteOptChildByKey(OptInt(person.id))
        responseObj.counterPersons++
      } catch (error) {
        responseObj.notProcessed.push(person.fullname)
      }
    }
    groupDoc.Save()

    if (responseObj.notProcessed.length > 0) {
      responseObj.success = true
      responseObj.code = 101
      responseObj.message = "Удалено " + responseObj.counterPersons + " из " + personsArray.length + " сотрудников, есть ошибки"
    }
  } catch (error) {
    responseObj.success = false
    responseObj.code = 500
    responseObj.message = "Ошибка при выполнении операции"
    responseObj.error = error.message
  }
  return responseObj
}
function moveToGroup(body) {
  var responseObj = {
    success: true,
    code: 200,
    message: "Все сотрудники успешно перемещены",
    counterPersons: 0,
    notProcessed: []
  }

  try {
    var selectedGroup = OptInt(body.currentGroup.id)
    var personsArray = body.selectedUsers
    var targetGroup = OptInt(body.targetGroup.id)

    var selectedGroupDoc = tools.open_doc(selectedGroup)
    var targetGroupDoc = tools.open_doc(targetGroup)

    for(person in personsArray) {
      try {
        selectedGroupDoc.TopElem.collaborators.DeleteOptChildByKey(OptInt(person.id))
        targetGroupDoc.TopElem.collaborators.ObtainChildByKey(person.id);
        responseObj.counterPersons++
      } catch (error) {
        responseObj.notProcessed.push(person.fullname)
      }
    }

    selectedGroupDoc.Save()
    targetGroupDoc.Save()

    if (responseObj.notProcessed.length > 0) {
      responseObj.success = true
      responseObj.code = 101
      responseObj.message = "Перемещено " + responseObj.counterPersons + " из " + personsArray.length + " сотрудников, есть ошибки"
    }
  } catch (error) {
    responseObj.success = false
    responseObj.code = 500
    responseObj.message = "Ошибка при выполнении операции или открытии документа"
    responseObj.error = error.message
    log(responseObj)
  }
  return responseObj
}
function installLeader(body) {
  var responseObj = {
    success: true,
    code: 200,
    message: "Руководитель успешно установлен",
    counterPersons: 0,
    notProcessed: []
  }
  var bossTypeId = OptInt("6148914691236517290")

  try {
    var selectedGroup = OptInt(body.currentGroup.id)
    var selectedLeadId = OptInt(body.selectedUser.id)
    var selectedGroupDoc = tools.open_doc(selectedGroup)
    var arrayGroupColl = selectedGroupDoc.TopElem.collaborators
    var docCollaborator
    var teDocCollaborator
    var funcManagers
    var leadId

    for(collaborator in arrayGroupColl) {
      docCollaborator = tools.open_doc(collaborator.collaborator_id)
      teDocCollaborator = docCollaborator.TopElem
      funcManagers = teDocCollaborator.func_managers
      funcManagers.DeleteChildren("This.boss_type_id == " + bossTypeId)
      docCollaborator.Save()
    }
    for(collaborator in arrayGroupColl) {
      docCollaborator = tools.open_doc(collaborator.collaborator_id)
      teDocCollaborator = docCollaborator.TopElem
      funcManagers = teDocCollaborator.func_managers

      leadId = funcManagers.ObtainChildByKey(selectedLeadId)
      tools.common_filling('collaborator', leadId, selectedLeadId)
      leadId.boss_type_id = bossTypeId
      docCollaborator.Save()
    }

  } catch (error) {
    responseObj.success = false
    responseObj.code = 500
    responseObj.message = "Ошибка при выполнении операции или открытии документа"
    responseObj.error = error.message
    log(responseObj)
  }

  return responseObj
}

function rewardsUpdate(body) {
  var excelData = body.excelObj
  var resultObj = {
    counterPersons: 0,
    notFoundPersons: [],
    dublicatePersons: []
  }

  for(var i = 0; i < excelData.length; i++) {
    rightPerson = findRightPerson(excelData[i], resultObj, false);

    if (rightPerson === null) {
      continue;
    }

    col_doc=tools.open_doc(rightPerson.id)
    col_te=col_doc.TopElem
    col_te.custom_elems.ObtainChildByKey('mentor_award_chick').value = excelData[i].chick
    col_te.custom_elems.ObtainChildByKey('mentor_award_owl').value = excelData[i].owl
    col_doc.Save()

    resultObj.counterPersons++
  }

  return resultObj;
}

function mentorsProfileUpdate(body) {
  var excelData = body.excelObj
  var resultObj = {
    counterPersons: 0,
    notFoundPersons: [],
    dublicatePersons: []
  }

  for(var i = 0; i < excelData.length; i++) {
    rightPerson = findRightPerson(excelData[i], resultObj, false);

    if (rightPerson === null) {
      continue;
    }

    col_doc=tools.open_doc(rightPerson.id)
    col_te=col_doc.TopElem
    col_te.custom_elems.ObtainChildByKey('selection_procedure').value = excelData[i].mentor
    col_doc.Save()
    resultObj.counterPersons++
  }
  return resultObj;
}

function assignAdaptation(body) {
  var resultObj = {
    countCreateAdapt: 0,
    notFoundPersons: [],
    dublicatePersons: [],
    notFoundProgramm: [],
    haveAProgramm: [],
    haventPosDate: []
  }
  var aProgramChoice = ["position_common", "position_family", "subdivision_group"]
  var excelData = body.excelObj
  var xarrCollaborators = []
  var xarrPositions = new Array();
  var xarrPositionCommons = new Array();
  var arrPositionFamilyIds = new Array();
  var arrObjectRequiraments = new Array();
  var xarrSubdivisionGroups = new Array();
  var xarrObjectRequiraments = new Array();
  var days_for_check = 20; // Проверять, была ли адаптация за последние N дней
  var sAdaptationType = "ext";
  var dStartDate = DateNewTime(Date(body.startDate), 0, 0, 0);
  var aTutors = [4, 5]
  var int_hire_date_days = 20; // кол-во дней с даты приема
  var int_position_date_days = 20; // кол-во дней с даты вступления в должность
  var aSendTypes = [1, 2, 3];
  var iPersonNotificationID = OptInt("7146169092266397766"); 
  var iTutorNotificationID = OptInt("7146169629248269491");
  var iBossNomailNotificationID = OptInt("6992442901426592165");
  var iAdminNobossNotificationID = OptInt("6993074572807339018");
  var iTutorAppointmentNotificationID = OptInt("6993074572807339059");
  var iBossTutorNomailNotificationID = OptInt("6993074572807339106");

  var iGroupSuperviserID = OptInt(getParam("group_superviser"));
  var iGroupAdminsID = OptInt(getParam("admin_adaptation_group"));
  var INT_GROUP_SALES = OptInt(getParam("int_group_sales_id"));
  var INT_GROUP_NOT_SALES = OptInt(getParam("int_group_not_sales_id"));
  var INT_GROUP_LOGIST = OptInt(getParam('int_group_logist_id'));
  var INT_GROUP_LOGIST_CUD = OptInt(getParam('int_group_logist_cud_id'));

  function getSuperviser(subdivision_id) {
    var managers = XQuery("sql:
      WITH RecursiveCTE AS (
          SELECT 
            id, 
            name, 
            parent_object_id
          FROM 
            subdivisions
          WHERE 
            id = "+subdivision_id+"
      
          UNION ALL
      
          SELECT 
            s.id, 
            s.name, 
            s.parent_object_id
          FROM 
            subdivisions s
          INNER JOIN 
            RecursiveCTE rcte ON s.id = rcte.parent_object_id
      )
      SELECT 
        rcte.id AS subdivision_id,
        rcte.name AS subdivision_name,
        rcte.parent_object_id,
        m.value('(./person_id)[1]', 'varchar(max)') person_id,
        m.value('(./person_fullname)[1]', 'varchar(max)') person_fullname,
        m.value('(./boss_type_id)[1]', 'varchar(max)') boss_type_id
      FROM 
        RecursiveCTE rcte
      JOIN 
        subdivision s ON s.id = rcte.id
      OUTER APPLY 
        s.data.nodes('subdivision/func_managers/func_manager') AS managers(m); 
      ")

      var superviserType = OptInt("7105332651422086498");

      for (manager in managers) {
          if (String(manager.boss_type_id) == String(superviserType)) {
              return manager.person_id;
          }
      }
      return undefined;
  }

  function getPersonFromGroup(group_id) {
    var query = ArraySelectAll(XQuery("sql:
    SELECT
    cols.id,   
        cols.fullname,
        cols.position_id,
        cols.position_name,
        cols.position_parent_id,
        cols.position_parent_name,
        cols.org_id,
        cols.org_name
    FROM group_collaborators gc
    JOIN collaborators cols ON cols.id = gc.collaborator_id
    WHERE gc.group_id = "+group_id+""))
    return query;
  }

  for (el in excelData) {
    rightPerson = findRightPerson(el, resultObj, true);

    if (rightPerson === null) {
      continue;
    }
    xarrCollaborators.push(rightPerson)
  }

  if (ArrayOptFind(aProgramChoice, "This == 'position_common' || This == 'position_family'") != undefined) {
		xarrPositions = XQuery("for $elem_qc in positions where MatchSome( $elem_qc/id, ( " + ArrayMerge(xarrCollaborators, "This.position_id", ",") + " ) ) return $elem_qc/Fields('id','position_common_id','position_family_id')");

		if (ArrayOptFind(xarrPositions, "This.position_common_id.HasValue") != undefined) {
			xarrPositionCommons = XQuery("for $elem_qc in position_commons where MatchSome( $elem_qc/id, ( " + ArrayMerge(ArraySelect(ArraySelectDistinct(xarrPositions, "This.position_common_id"), "This.position_common_id.HasValue"), "This.position_common_id", ",") + " ) ) return $elem_qc/Fields('id','position_familys')");
		}

		if (ArrayOptFind(aProgramChoice, "This == 'position_common'") != undefined) {
			arrObjectRequiraments = ArrayExtractKeys(xarrPositionCommons, "id");
		}

		if (ArrayOptFind(aProgramChoice, "This == 'position_family'") != undefined) {
			if (ArrayOptFind(xarrPositions, "This.position_family_id.HasValue") != undefined) {
				arrPositionFamilyIds = ArrayExtractKeys(ArraySelect(ArraySelectDistinct(xarrPositions, "This.position_family_id"), "This.position_family_id.HasValue"), "position_family_id");
			}

			if (ArrayOptFind(xarrPositionCommons, "This.position_familys.HasValue") != undefined) {
				for (_pc in ArraySelect(xarrPositionCommons, "This.position_familys.HasValue")) {
					arrPositionFamilyIds = ArrayUnion(arrPositionFamilyIds, ArrayExtract(String(_pc.position_familys).split(";"), "OptInt( This )"));
				}
				arrPositionFamilyIds = ArraySelectDistinct(arrPositionFamilyIds, "This");
			}
			arrObjectRequiraments = ArrayUnion(arrObjectRequiraments, arrPositionFamilyIds);
		}
	}

	if (ArrayOptFind(aProgramChoice, "This == 'subdivision_group'") != undefined) {
		xarrSubdivisionGroups = XQuery("for $elem_qc in subdivision_group_subdivisions where MatchSome( $elem_qc/subdivision_id, ( " + ArrayMerge(ArraySelect(ArraySelectDistinct(xarrCollaborators, "This.position_parent_id"), "This.position_parent_id.HasValue"), "This.position_parent_id", ",") + " ) ) return $elem_qc/Fields('subdivision_id','subdivision_group_id')");

		if (ArrayOptFirstElem(xarrSubdivisionGroups) != undefined) {
			arrObjectRequiraments = ArrayUnion(arrObjectRequiraments, ArrayExtractKeys(ArraySelectDistinct(xarrSubdivisionGroups, "subdivision_group_id"), "subdivision_group_id"));
		}
	}

	if (ArrayOptFirstElem(arrObjectRequiraments) != undefined) {
		xarrObjectRequiraments = XQuery("for $elem in object_requirements where MatchSome( $elem/object_id, ( " + ArrayMerge(arrObjectRequiraments, "This", ",") + " ) ) and $elem/requirement_object_type = 'typical_development_program' return $elem/Fields('object_id','additional_param','requirement_object_id')");
	}

	var xarrAdaptations = XQuery("for $elem_qc in career_reserves where MatchSome( $elem_qc/person_id, ( " + ArrayMerge(xarrCollaborators, "This.id", ",") + " ) ) return $elem_qc/Fields('id','person_id','position_type','status','start_date')");
	xarrAdaptations = ArraySelectByKey(xarrAdaptations, "adaptation", "position_type");
	var docCollaborator, arrTempObjectRequiramentIds, arrTempObjectRequirements, catAdaptation, docAdaptation, iAdaptationID, isHireDateEmpty, isPositionDateEmpty;
	var catPosition = null;
	var iCountCreated = 0;
	var catPositionCommon = null;
	var catTutorBossType = ArrayOptFirstElem(XQuery("for $elem in boss_types where $elem/code = 'talent_pool_tutor' return $elem"));
	var catDirectBossType = ArrayOptFirstElem(XQuery("for $elem in boss_types where $elem/code = 'main' return $elem"));
	var catSuperviserBossType = ArrayOptFirstElem(XQuery("for $elem in boss_types where $elem/code = 'superviser_tutor' return $elem"));
	var catAdministratorBossType = ArrayOptFirstElem(XQuery("for $elem in boss_types where $elem/code = 'talent_pool_administrator' return $elem"));

	for (_col in xarrCollaborators) {
		try {
			docCollaborator = tools.open_doc(_col.id);

			if (docCollaborator == undefined) continue;

			catPosition = null;
			catPositionCommon = null;
			arrTempObjectRequiramentIds = new Array();

			isHireDateEmpty = IsEmptyValue(RValue(docCollaborator.TopElem.hire_date));
			isPositionDateEmpty = IsEmptyValue(RValue(docCollaborator.TopElem.position_date));

			if (isHireDateEmpty || isPositionDateEmpty) {
				log("У сотрудника [" + _col.id + "] отсутствуют поля 'Дата найма' И/ИЛИ 'Дата встпуления в должность'. Адапатция не будет назначена");
        resultObj.haventPosDate.push(String(_col.fullname))
				continue;
			}

			for (_pc in aProgramChoice) {
				switch (_pc) {
					case "position_common":
						if (catPosition == null) {
							catPosition = ArrayOptFindByKey(xarrPositions, _col.position_id, "id");
						}
						if (catPosition == undefined || !catPosition.position_common_id.HasValue) {
							continue;
						}

						if (catPositionCommon == null) {

							catPositionCommon = ArrayOptFindByKey(xarrPositionCommons, catPosition.position_common_id, "id");
						}

						if (catPositionCommon == undefined) {
							continue;
						}
						arrTempObjectRequiramentIds.push(catPositionCommon.id.Value);
						break;

					case "position_family":
						if (catPosition == null) {
							catPosition = ArrayOptFindByKey(xarrPositions, _col.position_id, "id");
						}
						if (catPosition == undefined || !catPosition.position_common_id.HasValue) {
							continue;
						}
						if (catPosition.position_family_id.HasValue) {
							arrTempObjectRequiramentIds.push(catPosition.position_family_id);
						}
						if (!catPosition.position_common_id.HasValue) {
							continue;
						}
						if (catPositionCommon == null) {
							catPositionCommon = ArrayOptFindByKey(xarrPositionCommons, catPosition.position_common_id, "id");
						}
						if (catPositionCommon == undefined || !catPositionCommon.position_familys.HasValue) {
							continue;
						}
						arrTempObjectRequiramentIds = ArrayUnion(arrTempObjectRequiramentIds, ArrayExtract(String(catPositionCommon.position_familys).split(";"), "OptInt( This )"));

						break;

					case "subdivision_group":
						if (_col.position_parent_id.HasValue) {
							arrTempObjectRequiramentIds = ArrayUnion(arrTempObjectRequiramentIds, ArrayExtractKeys(ArraySelectByKey(xarrSubdivisionGroups, _col.position_parent_id, "subdivision_id"), "subdivision_group_id"));
						}
						break;
				}
			}

			if (ArrayOptFirstElem(arrTempObjectRequiramentIds) == undefined) {
				log("Автоматическое назначение адаптаций - для сотрудника " + _col.id + " не найдено типовых программ для назначения")
        resultObj.notFoundProgramm.push(String(_col.fullname))
				continue;
			}
			arrTempObjectRequirements = ArrayIntersect(xarrObjectRequiraments, arrTempObjectRequiramentIds, "This.object_id", "This");
			arrTempObjectRequirements = ArraySelect(arrTempObjectRequirements, "This.additional_param == sAdaptationType || This.additional_param == 'any'");
			if (ArrayOptFirstElem(arrTempObjectRequirements) == undefined) {
				log("Автоматическое назначение адаптаций - для сотрудника " + _col.id + " не найдено типовых программ для назначения")
        resultObj.notFoundProgramm.push(String(_col.fullname))
				continue;
			}
			arrTempObjectRequirements = ArraySelectDistinct(arrTempObjectRequirements, "This.requirement_object_id");

			docAdaptation = null;
			catAdaptation = {}
			allAdapts = ArraySelectByKey(xarrAdaptations, _col.id, "person_id");
			hasRecentAdaptation = false;

			if (ArrayCount(allAdapts) > 0) {
				currentDate = Date();
        resultObj.haveAProgramm.push(String(_col.fullname))
				for (elem in allAdapts) {
					if (days_for_check > 0 && elem.start_date.HasValue) {
						daysDiff = (DateToRawSeconds(currentDate) - DateToRawSeconds(elem.start_date)) / 86400;
						if (daysDiff <= days_for_check) {
							hasRecentAdaptation = true;
							break;
						}
					}

					if (elem.status.Value == 'active') {
						catAdaptation.status = 'active';
						catAdaptation.id = elem.id;
					}
				}
			}

			if (hasRecentAdaptation) {
				log("У сотрудника " + _col.id + " есть адаптации за последние " + days_for_check + " дней. Адаптация не будет назначена.");
        // resultObj.haveAProgramm.push(String(_col.fullname))
				continue;
			}

			if (!catAdaptation.HasProperty('status')) {
				catAdaptation = undefined;
			}

			if (catAdaptation == undefined) {
				docAdaptation = OpenNewDoc('x-local://wtv/wtv_career_reserve.xmd');
				docAdaptation.BindToDb();
				docAdaptation.TopElem.person_id = _col.id;
				docAdaptation.TopElem.status = 'active';
				tools.common_filling('collaborator', docAdaptation.TopElem, _col.id, docCollaborator.TopElem);
				docAdaptation.TopElem.start_date = dStartDate;
				docAdaptation.TopElem.readiness_percent = 0;
				docAdaptation.TopElem.position_type = "adaptation";
				docAdaptation.TopElem.position_name = docCollaborator.TopElem.position_name;
				docAdaptation.TopElem.subdivision_id = docCollaborator.TopElem.position_parent_id;
				docAdaptation.TopElem.autocalculate_readiness_percent = false;

				// Назначение наставников 1С
				try {
					if (ArrayOptFind(aTutors, "This == 4") != undefined) {
						oDirectBoss = tools.get_uni_user_boss(docCollaborator.TopElem)
						directTutor = ArrayOptFind(docCollaborator.TopElem.func_managers, "This.boss_type_id == " + catTutorBossType.id)

						if (oDirectBoss != undefined && oDirectBoss.id) {
							adaptationDirectBoss = docAdaptation.TopElem.tutors.ObtainChildByKey(oDirectBoss.id);
							tools.common_filling('collaborator', adaptationDirectBoss, oDirectBoss.id);
							if (catDirectBossType != undefined) {
								adaptationDirectBoss.boss_type_id = catDirectBossType.id;
							}
						}

						if (directTutor != undefined) {
							adaptationDirectTutor = docAdaptation.TopElem.tutors.ObtainChildByKey(directTutor.person_id);
							tools.common_filling('collaborator', adaptationDirectTutor, directTutor.person_id);
							if (catTutorBossType != undefined) {
								adaptationDirectTutor.boss_type_id = catTutorBossType.id;
							}
						}
					}
				} catch (e) {
					log(e.message + " 05.02.2024 #42423 Назначение наставников 1С")
				}

				try {
					if (ArrayOptFind(aTutors, "This == 5") != undefined) {
						oSuperviserBoss = getSuperviser(docCollaborator.TopElem.position_parent_id);

						if (oSuperviserBoss != undefined) {
							curUserID = oSuperviserBoss;
							inSuperviserGroup = tools.is_by_group_id(iGroupSuperviserID);

							if (tools_web.is_true(inSuperviserGroup)) {
								adaptationSuperviserBoss = docAdaptation.TopElem.tutors.ObtainChildByKey(oSuperviserBoss);
								tools.common_filling('collaborator', adaptationSuperviserBoss, oSuperviserBoss);
								if (catSuperviserBossType != undefined) {
									adaptationSuperviserBoss.boss_type_id = catSuperviserBossType.id;
								}
							}
						}
					}
				} catch (e) {
					log(e.message + "Назначение супервайзера наставника")
				}

				docAdaptation.Save();

				iCountCreated++;
        resultObj.countCreateAdapt++
				iAdaptationID = docAdaptation.DocID;

        arrBossSendNotification = new Array();
        for (_send_type in aSendTypes) {
          switch (String(_send_type)) {
            // уведомление сотруднику
            case "1":
              if (iPersonNotificationID != undefined)
                try {
                  if (docCollaborator.TopElem.email.Value == undefined || docCollaborator.TopElem.email.Value == "") {
                    if (iBossNomailNotificationID != undefined) {
                      oDirectBoss = tools.get_uni_user_boss(docCollaborator.TopElem)
                      tools.create_notification(
                        iBossNomailNotificationID,
                        oDirectBoss.id.Value,
                        "",
                        iAdaptationID
                      );
                    }
                  } else {
                    tools.create_notification(iPersonNotificationID, _col.id, "", iAdaptationID, docCollaborator.TopElem, docAdaptation.TopElem);
                  }
                }
              catch (err) {
                log(err)
              }
              break;
            // уведомление руководителю
            case "2":
              if (iTutorNotificationID != undefined) {
                try {
                  oDirectBoss = tools.get_uni_user_boss(docCollaborator.TopElem)
                  if (oDirectBoss != undefined) {
                    arrBossSendNotification.push(oDirectBoss.id.Value)
                  } else if (iAdminNobossNotificationID != undefined) {
                    arrAdmins = tools.open_doc(iGroupAdminsID).TopElem.collaborators
                    for (oAdmin in arrAdmins) {
                      tools.create_notification(
                        iAdminNobossNotificationID,
                        oAdmin.collaborator_id.Value,
                        "",
                        iAdaptationID
                      );
                    }
                  }
                } catch (e) {
                  log(e.message)
                }
              }
              break;
            // уведомление наставнику
            case "3":
              try {
                oDirectBoss = tools.get_uni_user_boss(docCollaborator.TopElem);
                for (oTutor in docAdaptation.TopElem.tutors) {
                  teTutor = tools.open_doc(oTutor.person_id).TopElem;
                  if (teTutor.email.Value != undefined && teTutor.email.Value != "") {
                    if(oTutor.boss_type_id == OptInt("5703809445382982252")) {
                      tools.create_notification(
                        iTutorAppointmentNotificationID,
                        teTutor.id.Value,
                        "",
                        iAdaptationID
                      );
                    }
                  } else {
                    tools.create_notification(
                      iBossTutorNomailNotificationID,
                      oDirectBoss.id.Value,
                      oTutor.person_fullname,
                      iAdaptationID
                    );
                  }
                }
              } catch (e) {
                log(e.message)
              }
              break;
          }
        }
        for (_boss_id in ArraySelectDistinct(arrBossSendNotification, "This")) {
          try {
            tools.create_notification(iTutorNotificationID, _boss_id, "", _col.id, null, docAdaptation.TopElem);
          } catch (err) {
            log(err)
          }
        }

        // назначение администраторов адаптации
        try {
          arrAdminGroup = getPersonFromGroup(iGroupAdminsID)
          for(admin in arrAdminGroup) {
            adaptationAdmins = docAdaptation.TopElem.tutors.ObtainChildByKey(admin.id)
            tools.common_filling('collaborator', adaptationAdmins, admin.id)
            if(catAdministratorBossType != undefined) {
              adaptationAdmins.boss_type_id = catAdministratorBossType.id
            }
          }

        } catch (error) {
          log(error.message + "Назначение администраторов адаптации")
        }

				// Временное отключение автоназначения
				arrDisabledAutoAppointmentTasks = []
				try {
					sTypicalDevelopmementProgramId = ArrayOptFirstElem(arrTempObjectRequirements).GetOptProperty("requirement_object_id").Value
					docTypicalDevelopmementProgram = tools.open_doc(OptInt(sTypicalDevelopmementProgramId))
					for (oTypicalTask in docTypicalDevelopmementProgram.TopElem.tasks) {
						if (oTypicalTask.auto_appoint_learning.Value) {
							oTypicalTask.auto_appoint_learning = false
							arrDisabledAutoAppointmentTasks.push(oTypicalTask.id.Value)
						}
					}
					docTypicalDevelopmementProgram.Save()
				} catch (e) {
					log(e.message + " 05.02.2024 Временное отключение автоназначения")
				}

				tools.call_code_library_method("libTalentPool", "AssignTypicalPrograms", [iAdaptationID, docAdaptation, ArrayExtract(arrTempObjectRequirements, "This.requirement_object_id")]);

				// Установка статуса в работе и назначение курсов и тестов
				try {
					docAdaptation = tools.open_doc(docAdaptation.TopElem.id)
					dAdaptationCreationDate = Date(docAdaptation.TopElem.doc_info.creation.date)
					dAdaptationCreationDate = Date(Day(dAdaptationCreationDate) + '.' + Month(dAdaptationCreationDate) + '.' + Year(dAdaptationCreationDate) + ' 00:00')
					docAdaptation.TopElem.status = 'active'
					for (oTask in docAdaptation.TopElem.tasks) {
						try {
							dTaskStartDate = Date(oTask.start_date)
							oTaskStartDate = Date(Day(dTaskStartDate) + '.' + Month(dTaskStartDate) + '.' + Year(dTaskStartDate) + ' 00:00')
							if (dAdaptationCreationDate >= oTaskStartDate) {
								oTask.status = 'active'
							}
							if (
								oTask.status.Value == 'active' &&
								ArrayOptFind(arrDisabledAutoAppointmentTasks, "This == " + XQueryLiteral(oTask.typical_development_program_task_id)) != undefined
							) {
								if (oTask.type.Value == 'learning') {
									response = tools.activate_course_to_person(
										docAdaptation.TopElem.person_id.Value,
										oTask.object_id.Value
									)
									oTask.active_learning_id = response.TopElem.id

								} else if (oTask.type.Value == 'test_learning') {
									response = tools.activate_test_to_person(
										docAdaptation.TopElem.person_id.Value,
										oTask.object_id.Value
									)
									activeTestLearning = ArrayOptFirstElem(XQuery(
										"for $elem in active_test_learnings where $elem/person_id = " + docAdaptation.TopElem.person_id.Value +
										" and $elem/assessment_id = " + oTask.object_id.Value +
										" return $elem"
									))
									oTask.active_test_learning_id = activeTestLearning.id
								}
							}
						} catch (e) {
							log("Установка статуса в работе и назначение курсов и тестов: " + e.message)
						}
					}

					docAdaptation.Save()
				} catch (e) {
					log("Назначение статуса в работе: " + e.message)
				}

				// Восстановление автоназначения
				try {
					sTypicalDevelopmementProgramId = ArrayOptFirstElem(arrTempObjectRequirements).GetOptProperty("requirement_object_id").Value
					docTypicalDevelopmementProgram = tools.open_doc(OptInt(sTypicalDevelopmementProgramId))
					for (oTypicalTask in docTypicalDevelopmementProgram.TopElem.tasks) {
						if (ArrayOptFind(arrDisabledAutoAppointmentTasks, "This == " + XQueryLiteral(oTypicalTask.id))) {
							oTypicalTask.auto_appoint_learning = true
						}
					}
					docTypicalDevelopmementProgram.Save()
				} catch (e) {
					log(e.message + "Восстановление автоназначения")
				}

				// Прикрепление профилей КПЭ к плану адаптации
				try {
          docAdaptation = tools.open_doc(docAdaptation.TopElem.id)
          teAdaptation = docAdaptation.TopElem
          xCollaborator = ArrayOptFirstElem(
            XQuery("for $elem in collaborators where $elem/id = " + teAdaptation.person_id + " return $elem")
          )
          if (!xCollaborator.hire_date.Value || !xCollaborator.position_date.Value) {
            log('У сотрудника ' + xCollaborator.id + ' нет даты приема!')
          }
          isCollaboratorNew = ((DateToRawSeconds(teAdaptation.start_date.Value) - DateToRawSeconds(xCollaborator.hire_date.Value)) / 86400) <= int_hire_date_days
          isCollaboratorTransfered = ((DateToRawSeconds(teAdaptation.start_date.Value) - DateToRawSeconds(xCollaborator.position_date.Value)) / 86400) <= int_position_date_days
          isCollaboratorSales = ArrayOptFind(
            tools.open_doc(INT_GROUP_SALES).TopElem.collaborators,
            "This.collaborator_id == " + xCollaborator.id.Value
          ) != undefined
          isCollaboratorNotSales = ArrayOptFind(
            tools.open_doc(INT_GROUP_NOT_SALES).TopElem.collaborators,
            "This.collaborator_id == " + xCollaborator.id.Value
          ) != undefined
          isCollaboratorLogist = ArrayOptFind(
            tools.open_doc(INT_GROUP_LOGIST).TopElem.collaborators,
            "This.collaborator_id == " + xCollaborator.id.Value
          ) != undefined
          isCollaboratorLogistCud = ArrayOptFind(
            tools.open_doc(INT_GROUP_LOGIST_CUD).TopElem.collaborators,
            "This.collaborator_id == " + xCollaborator.id.Value
          ) != undefined

          oKpiSearchParams = {
            'Новый сотрудник': false,
            'Переведенный сотрудник': false,
            'Продающий': false,
            'Непродающий': false,
            'Логист': false,
            'ЛогистЦУД': false
          }

          if (isCollaboratorNew) {
            oKpiSearchParams['Новый сотрудник'] = true
          } else if (isCollaboratorTransfered) {
            oKpiSearchParams['Переведенный сотрудник'] = true
          }

          if (isCollaboratorSales) {
            oKpiSearchParams['Продающий'] = true
          } else if (isCollaboratorNotSales) {
            oKpiSearchParams['Непродающий'] = true
          } else if (isCollaboratorLogist) {
            oKpiSearchParams['Логист'] = true
          } else if (isCollaboratorLogistCud) {
            oKpiSearchParams['ЛогистЦУД'] = true
          }

          xarrKpiProfiles = XQuery("for $elem in kpi_profiles return $elem")
          for (xKpiProfile in xarrKpiProfiles) {

            docKpiProfile = tools.open_doc(xKpiProfile.id)
            if (docKpiProfile != undefined) {
              isKpiFit = true
              for (xKnowledgePart in docKpiProfile.TopElem.knowledge_parts) {

                if (
                  oKpiSearchParams.GetOptProperty(xKnowledgePart.knowledge_part_name.Value) != undefined &&
                  !oKpiSearchParams.GetOptProperty(xKnowledgePart.knowledge_part_name.Value)
                ) {
                  isKpiFit = false
                }
              }

              if (isKpiFit) {
                oPeriod = ArrayOptFind(docKpiProfile.TopElem.knowledge_parts, "StrContains(This.knowledge_part_name, 'месяц', true)")
                if (oPeriod != undefined) {
                  sPeriod = oPeriod.knowledge_part_name.Value.split(' ')[0]
                  if (sPeriod == "1") {
                    /* oKpiProfileInAdaptaion = teAdaptation.custom_elems.ObtainChildByKey('kpi_profile_30')
                    oKpiProfileInAdaptaion.value = xKpiProfile.id.Value */

                  } else if (sPeriod == "2" || sPeriod == "3") {
                    oKpiProfileInAdaptaion = teAdaptation.custom_elems.ObtainChildByKey('kpi_profile_60_90')
                    oKpiProfileInAdaptaion.value = xKpiProfile.id.Value
                  }
                }
              }
            }
          }
          docAdaptation.Save()
        } catch (e) {
          log(e.message + " #42447 Прикрепление профилей КПЭ к плану адаптации")
        }

				if (!docAdaptation.TopElem.plan_readiness_date.HasValue) {
					catMaxEndDateTask = ArrayOptMax(ArraySelect(docAdaptation.TopElem.tasks, "This.plan_date.HasValue"), "plan_date");
					if (catMaxEndDateTask != undefined) {
						docAdaptation.TopElem.plan_readiness_date = catMaxEndDateTask.plan_date;
						docAdaptation.Save()
					}
				}
			} else {
				iAdaptationID = catAdaptation.id;
				docAdaptation = tools.open_doc(iAdaptationID);
				if (docAdaptation == undefined) {
					log("Не удалось открыть карточку адаптации " + iAdaptationID);
					continue;
				}
				arrTempObjectRequirements = ArraySelect(arrTempObjectRequirements, "!docAdaptation.TopElem.tasks.ChildByKeyExists( This.requirement_object_id, 'typical_development_program_id' )");
				if (ArrayOptFirstElem(arrTempObjectRequirements) == undefined) {
					continue;
				}
			}
		} catch (ex) {
			log("Автоматическое назначение адаптаций " + ex);
		}
	}
	log("Создано адаптаций " + iCountCreated)

  return resultObj
}

function dataReducer(body) {
  var selectedAction = body.selectedAction.value

  try {
    switch(selectedAction) {
      case 'getCourses': return assignCourses(body); break;
      case 'getAssessments': return assignAssessments(body); break;
      case 'getGroups': return addToGroup(body); break;
      default:
        Response.SetRespStatus(400, '');
        Response.Write('{"error":"unknown action"}');
    }
  } catch (error) {
    log("Ошибка в редьюсере: " + error)
  }

}

function handler(body, method) {
  try {
    switch (method) {
      case 'getCourses': return getCourses(); break;
      case 'getAssessments': return getAssessments(); break;
      case 'getGroups': return getGroups(); break;
      case 'getCollaborators': return getCollaborators(body); break;
      case 'addToGroup': return addToGroup(body); break;
      case 'deletePersonFromGroup': return deletePersonFromGroup(body); break;
      case 'moveToGroup': return moveToGroup(body); break;
      case 'installLeader': return installLeader(body); break;
      case 'getPersonsGroup': return getPersonsGroup(body); break;
      case 'dataReducer': return dataReducer(body); break;
      case 'checkUserRole': return checkUserRole(); break;
      case 'rewardsUpdate': return rewardsUpdate(body); break;
      case 'mentorsProfileUpdate': return mentorsProfileUpdate(body); break;
      case 'assignAdaptation': return assignAdaptation(body); break;
      default:
        Response.SetRespStatus(400, '');
        Response.Write('{"error":"unknown action"}');
    }
  }
  catch (err) {
    log(err.message);
  }
}
function main(req, res) {
  try {
    var body = tools.read_object(req.Body);
    var method = req.Query.GetOptProperty("method", "");
    if (method === undefined) {
      throw HttpError({
        code: 400,
        message: "unknown method"
      });
    }
    var payload = handler(body, method);
    res.Write(tools.object_to_text(payload, "json"));
  }
  catch (error) {
    var errorObject = tools.read_object(error);
    Request.RespContentType = "application/json";
    Request.SetRespStatus(errorObject.GetOptProperty("code", 500), "");
    Response.Write(errorObject.GetOptProperty("message", error));
  }
}
main(Request, Response);
%>