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
function show(obj) {
  alert("Просматриваемый объект" + tools.object_to_text(obj, "json"));
}

function checkUserRole() {
  var menuItems = []

  var accessTrainingManagement = getParam("accessTrainingManagementId");
  var acessRewardsUpdate = getParam("acessRewardsUpdateId");
  var accessMentorProfile = getParam("accessMentorProfileId");
  var groupManagement = getParam("groupManagement")

  var isAccessTrainingManagement = selectOne("SELECT * FROM group_collaborators gc WHERE gc.group_id = " + accessTrainingManagement + " AND collaborator_id = " + curUserId);
  
  if (isAccessTrainingManagement !== undefined) {
    menuItems.push(
      {
        id: 1,
        title: 'Назначение курсов',
        route: '/TrainingManagement'
      }
    )
  }

  // var isGroupManagement = selectOne("SELECT * FROM group_collaborators gc WHERE gc.group_id = " + groupManagement + " AND collaborator_id = " + curUserId);

  // alert("Айди пользователя: " + curUserId + "Айди найденного в группе сотрудника: " + isGroupManagement.collaborator_id)

  //   if (OptInt(isGroupManagement.collaborator_id) === curUserId) {
  //     menuItems.push(
  //       {
  //         id: 2,
  //         title: 'Управление группами',
  //         route: '/groupManagement'
  //       }
  //     )
  //   }

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

  return menuItems;
}

function findRightPerson(personData, resultObj) {
  var _query_str = "SELECT id, fullname, position_name, position_parent_name FROM collaborators WHERE fullname = " + XQueryLiteral(personData.fullname);

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
    alert("Ошибка при выполнении запроса XQuery: " + err.message);
    return null;
  }
}

function getCourses() {
  var categoryCourseId = getParam("categoryCourseId")
  return selectAll("SELECT c.id, c.name, c.code, c.modification_date FROM courses c CROSS APPLY c.role_id.nodes('/role_id') AS R(x) WHERE R.x.value('.', 'varchar(50)') = '" + categoryCourseId + "'");
}
function getAssessments() {
  return selectAll("SELECT id, code, title AS name, modification_date FROM assessments");
}
function getGroups() {
  return selectAll("SELECT id, code, name, modification_date FROM groups");
}

function getPersonsGroup(body) {
  var groupId = body.id

  if(!groupId) {
    alert("Айди группы неизвестно")
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
    rightPerson = findRightPerson(excelData[i], resultObj);

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
    rightPerson = findRightPerson(excelData[i], resultObj);

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
  var selectedGroup = body.GetOptProperty("currentObj").id
  var excelData = body.excelObj

  var resultObj = {
    counterPersons: 0,
    notFoundPersons: [],
    dublicatePersons: [],
    prevAssign: []
  }

  for(var i = 0; i < excelData.length; i++) {
    rightPerson = findRightPerson(excelData[i], resultObj);

    if (rightPerson === null) {
      continue;
    }

    gr = tools.open_doc(selectedGroup)
    gr.TopElem.collaborators.ObtainChildByKey(rightPerson.id);
    gr.Save();
    resultObj.counterPersons++
  }
  return resultObj;
}

function rewardsUpdate(body) {
  var excelData = body.excelObj
  var resultObj = {
    counterPersons: 0,
    notFoundPersons: [],
    dublicatePersons: []
  }

  for(var i = 0; i < excelData.length; i++) {
    rightPerson = findRightPerson(excelData[i], resultObj);

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
    rightPerson = findRightPerson(excelData[i], resultObj);

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
    alert("Ошибка в редьюсере: " + error)
  }

}

function handler(body, method) {
  try {
    switch (method) {
      case 'getCourses': return getCourses(); break;
      case 'getAssessments': return getAssessments(); break;
      case 'getGroups': return getGroups(); break;
      case 'getPersonsGroup': return getPersonsGroup(body); break;
      case 'dataReducer': return dataReducer(body); break;
      case 'checkUserRole': return checkUserRole(); break;
      case 'rewardsUpdate': return rewardsUpdate(body); break;
      case 'mentorsProfileUpdate': return mentorsProfileUpdate(body); break;
      default:
        Response.SetRespStatus(400, '');
        Response.Write('{"error":"unknown action"}');
    }
  }
  catch (err) {
    alert(err.message);
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