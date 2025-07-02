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
  alert("Объект с фронта: " + tools.object_to_text(obj, "json"));
}

function getCourses() {
  return selectAll("SELECT id, code, name, modification_date FROM courses");
}
function getAssessments() {
  return selectAll("SELECT id, code, title AS name, modification_date FROM assessments");
}
function getGroups() {
  return selectAll("SELECT id, code, name, modification_date FROM groups");
}

function assignCourses(body) {
  var selectedCourse = body.GetOptProperty("currentObj").id
  var excelData = body.excelObj
  var time = body.GetOptProperty("time")

  var resultObj = {
    notFoundPersons: [],
    counterPersons: 0
  }

  alert('Зашли в нужную функцию')

  for(var i = 0; i < excelData.length; i++) {
    _query_str = "for $elem in collaborators where $elem/fullname = " + XQueryLiteral(excelData[i].person)

    if(excelData[i].position != null) {
      _query_str += " and $elem/position_name = " + XQueryLiteral(excelData[i].position)
    }
    if(excelData[i].subdivision != null) {
      _query_str += " and $elem/position_parent_name = " + XQueryLiteral(excelData[i].subdivision)
    }
    _query_str += ' return $elem';

    alert(_query_str)

    try {
      foundEmployee = XQuery(_query_str);
      firstPerson = ArrayOptFirstElem(foundEmployee);
      alert('Найденный сотрудник: ' + firstPerson)
    } catch (err) {
      alert("Ошибка при выполнении запроса XQuery: " + err.message);
      continue;
    }

    if (firstPerson == undefined) {
      resultObj.notFoundPersons.push(excelData[i])
      continue;
    }
     tools.activate_course_to_person(firstPerson.id, selectedCourse, null, null, null, time)
     resultObj.counterPersons++
  }
  return resultObj;
}
function assignAssessments(body) {
  alert("Назначение тестов, а не курсов")
  return {
    test: 'Тестовый объект'
  }
}
function addToGroup(body) {
  
}

function dataReducer(body) {
  var selectedAction = body.GetOptProperty("selectedAction").value

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
  }

}

function handler(body, method) {
  try {

    switch (method) {
      case 'getCourses': return getCourses(); break;
      case 'getAssessments': return getAssessments(); break;
      case 'getGroups': return getGroups(); break;
      case 'dataReducer': return dataReducer(body); break;
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