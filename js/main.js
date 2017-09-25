var DataManager;
var ResultsTable;
var InputManager;
var QueryManager;

function OnLoad() {
    DataManager = new DataManagerClass();
    ResultsTable = new ResultsTableClass();
    InputManager = new InputManagerClass();
    QueryManager = new QueryManagerClass();
    QueryManager.RefreshQueries();
}

function InputManagerClass() {
  var keyctrl = false;

  this.CommandBoxDown = function(event) {
    // console.log(event.keyCode);
    switch(event.keyCode) {
      case 27: //Escape
        document.getElementById('QueryTextArea').value = "";
        break;
      case 83: //s
        if(keyctrl) {
          keyctrl = false;
          event.preventDefault();
          event.stopPropagation();
          QueryManager.SaveQuery();
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
    DataManager.ExecuteSQL(sqlCommand, function() {ResultsTable.Display();});
  }
}

function QueryManagerClass() {
  this.QueryData = [];
  this.SelectedIndex = -1;

  this.RefreshQueries = function () {
    this.AjaxGetQueries(function() {QueryManager.DisplayQueries();});
  };

  this.AjaxGetQueries = function (CallBack) {
    $.ajax("php/ajaxgetqueries.php", {
        type: "POST",
        data: {
        },
        success: function (data) {
            QueryManager.QueryData = data;
            if(typeof(data) === "string")
              MainOutput.innerHTML = data;
            else
              CallBack();
        },
        error: function (data) {
          alert("Error with AjaxGetQueries");
        }
    });
  };

  this.AjaxSaveQuery = function (Name, Query, CallBack) {
    $.ajax("php/ajaxsavequery.php", {
        type: "POST",
        data: {
          name: Name,
          query: Query
        },
        success: function (data) {
            if(data === "success") {
              alert("Query Saved");
              CallBack();
            }
            else
              MainOutput.innerHTML = data;
        },
        error: function (data) {
          alert("Error with AjaxSaveQuery");
        }
    });
  };

  this.AjaxUpdateQuery = function (_ID, Query, CallBack) {
    $.ajax("php/ajaxupdatequery.php", {
        type: "POST",
        data: {
          ID: _ID,
          query: Query
        },
        success: function (data) {
            if(data === "success") {
              alert("Query Saved");
              CallBack();
            }
            else
              MainOutput.innerHTML = data;
        },
        error: function (data) {
          alert("Error with AjaxUpdateQuery");
        }
    });
  };


  this.DisplayQueries = function () {
    var html = "<div class='QueryItem' id='QueryItem-1' onclick='QueryManager.OnQueryClick(-1);'>New Query</div>";
    for(var i = 0; i < this.QueryData.length; i++) {
      html += "<div class='QueryItem' id='QueryItem" + this.QueryData[i].ID + "' onclick='QueryManager.OnQueryClick(" + this.QueryData[i].ID + ")'>";
      html += this.QueryData[i].Name;
      html += "</div>";
    }
    document.getElementById("SavedQueriesBox").innerHTML = html;
    this.HighlightSelected();
  };

  this.OnQueryClick = function (ID) {
    this.SelectedIndex = ID;
    if(ID !== -1) {
      for(var i = 0; i < QueryManager.QueryData.length; i ++) {
        if(QueryManager.QueryData[i].ID == ID) {
          document.getElementById("QueryTextArea").value = QueryManager.QueryData[i].Query;
          break;
        }
      }
    }
    document.getElementById("QueryTextArea").focus();
    this.HighlightSelected();
  };

  this.HighlightSelected = function() {
    var queryItems = document.querySelectorAll(".QueryItem");
    for (var i = 0; i < queryItems.length; i++) {
      queryItems[i].className = "QueryItem";
    }
    document.getElementById("QueryItem" + this.SelectedIndex).className += " SelectedQuery";
  };

  this.SaveQuery = function () {
    if(this.SelectedIndex === -1) {
      var queryName = prompt("Enter Query Name","Save Query");
      if(queryName !== null) {
        this.AjaxSaveQuery(queryName, document.getElementById("QueryTextArea").value, function() {QueryManager.RefreshQueries();});
      }
    }
    else
      this.AjaxUpdateQuery(this.SelectedIndex, document.getElementById("QueryTextArea").value, function() {QueryManager.RefreshQueries();});
  };
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
          case 1: //Bool
          case 2: //Small Int
          case 3: //Integer
          case 8: //Big Int
          case 9: //Medium Int
          case 13: //Year
          case 16: //Bit
            html += DataManager.DetailData[i][columnHeaders[j]].toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            break;
          case 4: //Float
          case 5: //Double
          case 246: //Decimal
            html += DataManager.DetailData[i][columnHeaders[j]].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
            break;
          case 7: //Timestamp
          case 10: //Date
          case 11: //Time
          case 12: //DateTime
          case 252: //TinyBlob
          case 253: //VarChar
          case 254: //Binary
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
