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

  // var resultObj = {
  //   notFoundPersons: [],
  //   counterPersons: 0,
  //   dublicatePersons: []
  // }

  var resultObj = {
    "notFoundPersons": [
        {
            "person": "Виктор Викторович Калория",
            "position": "Министр спорта",
            "subdivision": "Отдел здравоохранения"
        },
        {
            "person": "Евгений Сергеевич Мразь",
            "position": null,
            "subdivision": null
        }
    ],
    "counterPersons": 3,
    "dublicatePersons": [
        {
            "id": "7122562520422422213",
            "code": "8574f7ed-072e-11ed-a2bc-00155dfcf00e",
            "fullname": "Богович Алексей Иванович",
            "login": "a.bogovich",
            "short_login": "a.bogovich",
            "lowercase_login": "a.bogovich",
            "email": "a.bogovich@petrovich.ru",
            "phone": "",
            "mobile_phone": "89251014078",
            "birth_date": "1993-11-10T00:00:00+00:00",
            "sex": "m",
            "pict_url": "",
            "position_id": "7364760360504280111",
            "position_name": "Звеньевой грузчиков бригады подъема",
            "position_parent_id": "7364759305094386192",
            "position_parent_name": "Отдел транспортной логистики СТЦ Симферопольское шоссе",
            "org_id": "7364654937381434225",
            "org_name": "ООО \"СТД \"Петрович\"",
            "category_id": "",
            "web_banned": false,
            "is_arm_admin": false,
            "role_id": "user",
            "is_candidate": false,
            "candidate_status_type_id": null,
            "is_outstaff": false,
            "is_dismiss": false,
            "position_date": "2024-04-25T00:00:00+00:00",
            "hire_date": "2024-04-25T00:00:00+00:00",
            "dismiss_date": null,
            "in_request_black_list": false,
            "level_id": "5997324846008634213",
            "knowledge_parts": "",
            "tags": "",
            "experts": "",
            "person_object_profile_id": "",
            "current_state": "",
            "development_potential_id": null,
            "efficiency_estimation_id": null,
            "modification_date": "2025-01-26T19:05:10+00:00",
            "app_instance_id": "",
            "place_id": null,
            "region_id": null,
            "is_content_admin": false,
            "candidate_id": null,
            "allow_personal_chat_request": true,
            "is_application_admin": false,
            "grade_id": null,
            "next_state_date": null,
            "consent_kedo": false,
            "consent_kedo_date": null,
            "provider_legal_id": "",
            "snils": "",
            "cost_center_id": null,
            "disp_birthdate": true,
            "disp_birthdate_year": true
        },
        {
            "id": "7364385882588729961",
            "code": "bogovich",
            "fullname": "Богович Алексей Иванович",
            "login": "bogovich",
            "short_login": "bogovich",
            "lowercase_login": "bogovich",
            "email": "",
            "phone": "",
            "mobile_phone": "+7(926)142-70-56",
            "birth_date": "1993-11-10T00:00:00+00:00",
            "sex": "",
            "pict_url": "",
            "position_id": "7364385882795815501",
            "position_name": "Грузчик МБП",
            "position_parent_id": "7364385882092815089",
            "position_parent_name": "Симферопольское ш.",
            "org_id": null,
            "org_name": "",
            "category_id": "",
            "web_banned": false,
            "is_arm_admin": false,
            "role_id": "user",
            "is_candidate": false,
            "candidate_status_type_id": null,
            "is_outstaff": false,
            "is_dismiss": false,
            "position_date": null,
            "hire_date": "2022-05-18T00:00:00+00:00",
            "dismiss_date": null,
            "in_request_black_list": false,
            "level_id": null,
            "knowledge_parts": "",
            "tags": "",
            "experts": "",
            "person_object_profile_id": "",
            "current_state": "",
            "development_potential_id": null,
            "efficiency_estimation_id": null,
            "modification_date": "2025-01-27T14:53:23+00:00",
            "app_instance_id": "",
            "place_id": null,
            "region_id": null,
            "is_content_admin": false,
            "candidate_id": null,
            "allow_personal_chat_request": true,
            "is_application_admin": false,
            "grade_id": null,
            "next_state_date": null,
            "consent_kedo": false,
            "consent_kedo_date": null,
            "provider_legal_id": "",
            "snils": "",
            "cost_center_id": null,
            "disp_birthdate": true,
            "disp_birthdate_year": true
        }
    ]
}

  // for(var i = 0; i < excelData.length; i++) {
  //   _query_str = "SELECT * FROM collaborators WHERE fullname = " + XQueryLiteral(excelData[i].person);

  //   if (excelData[i].position !== null) {
  //     _query_str += " AND position_name = " + XQueryLiteral(excelData[i].position);
  //   }
  //   if (excelData[i].subdivision !== null) {
  //     _query_str += " AND position_parent_name = " + XQueryLiteral(excelData[i].subdivision);
  //   }
  //   _query_str += " AND is_dismiss = 0 OR (is_dismiss = 1 AND dismiss_date IS NOT NULL AND dismiss_date >= DATEADD(month, -3, CAST(GETDATE() AS date)))";

  //   try {
  //     receivedPersons = selectAll(_query_str)

  //     if (receivedPersons.length === 0) {
  //       resultObj.notFoundPersons.push(excelData[i])
  //       continue;
  //     }
      
  //     if(receivedPersons.length > 1) {
  //       for(person in receivedPersons) {
  //         resultObj.dublicatePersons.push(person)
  //       }
  //       continue;
  //     }
      
  //     rightPerson = receivedPersons[0]

  //     alert("Найденный сотрудник: " + tools.object_to_text(rightPerson, "json"))

  //   } catch (err) {
  //     alert("Ошибка при выполнении запроса XQuery: " + err.message);
  //     continue;
  //   }

  //    tools.activate_course_to_person(rightPerson.id, selectedCourse, null, null, null, time)
  //    resultObj.counterPersons++
  // }
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
  var selectedAction = body.selectedAction.value

  alert("Выбранная опция: " + selectedAction)

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