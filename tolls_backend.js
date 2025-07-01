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
function assignCourses() {
  var selectedCourse =  body.currentObj.id
  var excelObj = body.excelObj
  var time = body.time
  var selectedAction = body.selectedAction.value

  show(selectedCourse)
  show(excelObj)
  show(time)
  show(selectedAction)

}
function assignAssessments() {
  
}
function addToGroup() {
  
}

function handler(body, method) {
  try {

    switch (method) {
      case 'getCourses': return getCourses(); break;
      case 'getAssessments': return getAssessments(); break;
      case 'getGroups': return getGroups(); break;
      case 'assignCourse': return assignCourses(); break;
      case 'assignTest': return assignAssessments(); break;
      case 'addToGroup': return addToGroup(); break;
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