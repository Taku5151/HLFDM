var DataManager;
var ResultsTable;
var InputManager;

function OnLoad() {
    DataManager = new DataManagerClass();
    ResultsTable = new ResultsTableClass();
    InputManager = new InputManagerClass();
}

function InputManagerClass() {
  var keyctrl = false;

  this.CommandBoxDown = function(event) {
    console.log(event.keyCode);
    switch(event.keyCode) {
      case 27: //Escape
        document.getElementById('QueryTextArea').value = "";
        break;
      case 83: //s
        if(keyctrl) {
          keyctrl = false;
          this.ExecuteSQL();
        }
        break;
      case 91: //Ctrl
      case 17: //Ctrl
        keyctrl = true;
        break;
      case 13: //Enter
        if(keyctrl) {
          keyctrl = false;
          this.ExecuteSQL();
        }
      default:
        break;
    }
  }

  this.CommandBoxUp = function(event) {
    switch(event.keyCode) {
    case 91: //Ctrl
    case 17: //Ctrl
      keyctrl = false;
      break;
    default:
      break;
    }
  }

  this.ExecuteSQL = function() {
    var sqlCommand = document.getElementById('QueryTextArea').value.replace(/(\r\n|\n|\r)/gm,"");
    DataManager.ExecuteSQL(sqlCommand, function() {ResultsTable.Display()});
  }
}




function DataManagerClass() {
    this.DetailData = [];

    this.ExecuteSQL = function (SQLCommand, CallBack) {
        $.ajax("php/ajaxrunsql.php", {
            type: "POST",
            data: {
                SQLCommand: SQLCommand
            },
            success: function (data) {
                DataManager.DetailData = data;
                if(typeof(data) === "string")
                  MainOutput.innerHTML = data;
                else
                  CallBack();
            },
            error: function () {
                alert("Error with AjaxRunSQL");
            }
        });

    };
}


function ResultsTableClass() {
  var columnHeaders = [];
  var columnTypes = [];

  this.SetHeaderData = function() {
    columnHeaders = [];
    columnTypes = [];
    for (var i = 0; i < DataManager.DetailData[0].length; i++) {
      columnHeaders.push(DataManager.DetailData[0][i]["name"]);
      columnTypes.push(DataManager.DetailData[0][i]["type"]);
    }
  };


  this.Display = function () {
    this.SetHeaderData();

    var html = "";
    html += "<input type='button' onclick='UtilTableToCSV(\"DetailTable\")' value='Export'>";
    html += "<table id='DetailTable'>";
    html += "<colgroup>";
    for (var i = 0; i < columnHeaders.length; i++) {
      html += "<col class = DetailTableColumn>";
    }
    html += "</colgroup>";
    html += "<tr>";
    for (var i = 0; i < columnHeaders.length; i++) {
      html += "<th>";
      html += columnHeaders[i];
      html += "</th>";
    }
    html += "</tr>";

    for (var i = 1; i < DataManager.DetailData.length; i++) {
      html += "<tr>";
      for (var j = 0; j < columnHeaders.length; j++) {
        html += "<td>";
        switch(columnTypes[j]) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 8:
          case 9:
          case 13:
          case 16:
          case 246:
            html += DataManager.DetailData[i][columnHeaders[j]].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            break;
          case 7:
          case 10:
          case 11:
          case 12:
          case 252:
          case 253:
          case 254:
          default:
            html += DataManager.DetailData[i][columnHeaders[j]];
            break;
        }
        html += "</td>";
      }
      html += "</tr>";
    }
    html += "</table>";
    document.getElementById("MainOutput").innerHTML = html;
  };
}

function UtilTableToCSV(tableID) {
    var table = document.getElementById(tableID);
    var data = "";
    for (var i = 0; i < table.rows.length; i++) {
        if (i > 0)
            data += "\n";
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            if (j > 0)
                data += ",";
            data += "\"" + table.rows[i].cells[j].innerHTML.replace("\"", "") + "\"";
        }
    }

    var IE = window.navigator.userAgent.indexOf("MSIE");

    if (IE > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        var win = window.open();
        win.document.write('sep=,\r\n' + data);
        win.document.close();
        win.document.execCommand('SaveAs', true, tableID + ".csv");
        win.close();
    } else if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1)
    {
        var data = "data:text/csv;charset=utf-8," + data;
        var file = encodeURI(data);

        var templink = document.createElement("a");
        templink.setAttribute("href", file);
        templink.setAttribute("download", tableID + ".csv");
        templink.click();
    } else
    {
        var data = "data:text/csv;charset=utf-8," + data;
        var file = encodeURI(data);
        window.open(file);
    }


    /*
     if (navigator.appName == "Microsoft Internet Explorer") {
     var win = window.open();
     win.document.write('sep=,\r\n' + data);
     win.document.close();
     win.document.execCommand('SaveAs', true, tableID + ".csv");
     win.close();
     }
     else {
     var data = "data:text/csv;charset=utf-8,";
     var file = encodeURI(data);
     window.open(file);
     }
     */
}
