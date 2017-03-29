function update_data() {
    $.getJSON(
        "http://localhost:8000/getinfo",
        function(data) {
            $("#balance").html(data.getinfo.result.balance);
            $("#balance").removeClass();
            $("#stake").html(data.getinfo.result.stake);
            $("#newmint").html(data.getinfo.result.newmint);
            $("#magnitude").html(data.listrsa.result[1]["Magnitude (Last Superblock)"]);
            $("#lastblockpaid").html(data.listrsa.result[1]["Last Block Paid"]);
            $("#dailyearnings").html(data.listrsa.result[1]["Expected Earnings (Daily)"]);
            $("#txfee").html(data.getinfo.result.paytxfee);
            $("#cpid").html(data.listrsa.result[1].CPID);
            $("#unlocked_until").html(format_timestamp(data.getinfo.result.unlocked_until));
            $("#version").html(data.getinfo.result.version);
            $("#connections").html(data.getinfo.result.connections);
            $("#blocks").html(data.getinfo.result.blocks);
            $("#posdifficulty").html(data.getinfo.result.difficulty["proof-of-stake"].toFixed(2));
            $("#powdifficulty").html(data.getinfo.result.difficulty["proof-of-work"].toFixed(2));
        }
    ) .fail(function() {
        $("#balance").html("ERROR");
        $("#balance").removeClass();
        $("#balance").addClass("ERROR");
        $("#stake").html("");
        $("#newmint").html("");
        $("#unlocked_until").html("");
        $("#version").html("ERROR");
    });
    setTimeout(update_data,5000);
}

function format_timestamp(timestamp) {
    var tsdate = new Date(timestamp*1000);
    var year = tsdate.getFullYear();
    var month = tsdate.getMonth();
    var date = tsdate.getDate();
    var hour = tsdate.getHours();
    var min = tsdate.getMinutes();
    var sec = tsdate.getSeconds();
    return year + "-" + pad(month,2) + "-" + pad(date,2) + " " + pad(hour,2) + ":" + pad(min,2) + ":" + pad(sec,2);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

$(document).ready(function() {
  update_data();
});
