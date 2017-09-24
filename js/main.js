var keyctrl = false;

function commandBoxDown(event) {
  switch(event.keyCode) {
    case 91: //Ctrl
    case 17: //Ctrl
      keyctrl = true;
      break;
    case 13: //Enter
      if(keyctrl) {
        keyctrl = false;
        alert("Control Enter!");
      }
    default:
      break;
  }
}

function commandBoxUp(event) {
  switch(event.keyCode) {
  case 91: //Ctrl
  case 17: //Ctrl
    keyctrl = false;
    break;
  default:
    break;
  }
}

function ExecuteCommand() {
    $.ajax("php/ajaxrunsql.php", {
        type: "POST",
        data: {
            StartDate: StartDate,
            EndDate: EndDate
        },
        success: function (data) {
            DataManager.Cube = data;
            DataManager.AddPseudoKeys();
            KeyManager.CompileKeyData();
            CallBack();
        },
        error: function () {
            alert("Error with AjaxRunSQL");
        }
    });
}
