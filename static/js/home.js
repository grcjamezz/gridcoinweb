function update_data() {
    $.getJSON(
        "http://localhost:8000/update",
        function(data) {

            // Home
            $("#balance").html(data.info.result.balance);
            $("#balance").removeClass();
            $("#stake").html(data.info.result.stake);
            $("#newmint").html(data.info.result.newmint);
            $("#magnitude").html(data.rsa.result[1]["Magnitude (Last Superblock)"]);
            $("#lastblockpaid").html(data.rsa.result[1]["Last Block Paid"]);
            $("#dailyearnings").html(data.rsa.result[1]["Expected Earnings (Daily)"]);
            $("#txfee").html(data.info.result.paytxfee);
            $("#cpid").html(data.rsa.result[1].CPID);
            $("#unlocked_until").html(format_timestamp(data.info.result.unlocked_until));
            $("#version").html(data.info.result.version);
            $("#connections").html(data.info.result.connections);
            $("#blocks").html(data.info.result.blocks);
            $("#posdifficulty").html(data.info.result.difficulty["proof-of-stake"].toFixed(2));
            $("#powdifficulty").html(data.info.result.difficulty["proof-of-work"].toFixed(2));

            // Transactions
            var transhtml="";
            var trans=data.transactions.result
            $("#transdata").empty();
            for (var row=trans.length-1; row >= 0; row--) {
                var account = trans[row].account;
                if (account == "") {
                    account = "(unknown)";
                }
                transhtml += "<tr>";
                transhtml += "<td>" + "<a href=\"#\" onClick='showtx(\"" +
                    trans[row].txid + "\");'>" +
                    trans[row].txid.substring(0,6) + "</a></td>";
                transhtml += "<td>" + account + "</td>";
                transhtml += "<td>" + trans[row].amount + "</td>";
                transhtml += "<td>" + trans[row].category + "</td>";
                transhtml += "<td>" + trans[row].confirmations + "</td>";
                transhtml += "<td>" + format_timestamp(trans[row].time) + "</td>";
                transhtml += "</tr>";

                // Add data to hidden txdata element
                item=document.createElement("div");
                item.id=trans[row].txid;
                item.innerHTML=trans[row].txid;
                $(item).data("txdata", trans[row]);
                $("#transdata").append(item);
            }
            $("#transtable").html(transhtml);
            $("#transtable").removeClass();

            // Addresses
            var addresseshtml="";
            var alladdresses=data.addresses.result[0];
            for (var outer=0; outer < alladdresses.length; outer++) {
                var addresses=data.addresses.result[outer];
                for (var row=0; row < addresses.length; row++) {
                    var account = addresses[row][2];
                    if (account === undefined) {
                        account = "(unknown)";
                    }
                    addresseshtml += "<tr>";
                    addresseshtml += "<td>" + "<a target=\"_blank\" href=\"https://gridcoinstats.eu/addresses.php?a=view&id=" +
                        addresses[row][0] + "\" data-toggle=\"tooltip\" title=\"gridcoinstats.eu\">" +
                        addresses[row][0] + "</a></td>";
                    addresseshtml += "<td>" + account + "</td>";
                    addresseshtml += "<td>" + addresses[row][1] + "</td>";
                    addresseshtml += "</tr>";
                }
            }
            $("#addresstable").html(addresseshtml);
            $("#addresstable").removeClass();

            // Peers
            var peershtml="";
            var peers=data.peerinfo.result;
            $("#peerdata").empty();
            //var now=(new Date).getTime()/1000;
            for (var row=0; row < peers.length; row++) {
                if (peers[row].inbound === true) {
                    var dir = 'inbound';
                } else {
                    var dir = 'outbound';
                }
                var verdel1=peers[row].subver.indexOf(":");
                var verdel2=peers[row].subver.indexOf(")/");
                var ver=peers[row].subver.substring(verdel1+1,verdel2+1);
                var hashcode=hash(peers[row].addr);

                //var lastrecv=now-peers[row].lastrecv;
                //var lastsend=now-peers[row].lastsend;
                peershtml += "<tr>";
                peershtml += "<td>" + "<a href=\"#\" onClick='showpeer(\"" +
                    hashcode + "\");'>" + peers[row].addr + "</a></td>";
                peershtml += "<td>" + dir + "</td>";
                peershtml += "<td>" + ver + "</td>";
                peershtml += "<td>" + peers[row].pingtime.toFixed(3) + "</td>";
                peershtml += "<td>" + format_timestamp(peers[row].conntime) + "</td>";
                //peershtml += "<td>" + lastrecv + "</td>";
                //peershtml += "<td>" + lastsend + "</td>";
                //peershtml += "<td>" + format_timestamp(peers[row].lastrecv) + "</td>";
                //peershtml += "<td>" + format_timestamp(peers[row].lastsend) + "</td>";
                peershtml += "</tr>";

                // Add data to hidden txdata element
                item=document.createElement("div");
                item.id=hashcode;
                item.innerHTML=hashcode;
                $(item).data("peerdata", peers[row]);
                $("#peerdata").append(item);
            }
            $("#peerstable").html(peershtml);
            $("#peerstable").removeClass();
        }
    ) .fail(function() {
        $("#balance").html("ERROR");
        $("#balance").removeClass();
        $("#balance").addClass("error");
        $("#stake").html("");
        $("#newmint").html("");
        $("#unlocked_until").html("");
        $("#version").html("ERROR");

        $("#transtable").html("ERROR");
        $("#transtable").removeClass();
        $("#transtable").addClass("error");

        $("#peerstable").html("ERROR");
        $("#peerstable").removeClass();
        $("#peerstable").addClass("error");

        $("#addresstable").html("ERROR");
        $("#addresstable").removeClass();
        $("#addresstable").addClass("error");

        $("#transdata").empty();
    });

    //setTimeout(update_data,5000);
}

function showtx(d) {
    var txdata = $("#"+d).data("txdata");
    var transtablehtml=""
    for (var key in txdata) {
        var value = txdata[key];
        switch (key) {
            case "address":
                value = "<a target=\"_blank\" href=\"https://gridcoinstats.eu/addresses.php?a=view&id=" +
                    txdata[key] + "\" data-toggle=\"tooltip\" title=\"gridcoinstats.eu\">" +
                    txdata[key] + "</a>";
                break;
            case "txid":
                value = "<a target=\"_blank\" href=\"https://gridcoinstats.eu/block.php?tx=" +
                    txdata[key] + "\" data-toggle=\"tooltip\" title=\"gridcoinstats.eu\">" +
                    txdata[key] + "</a>";
                break;
            case "blocktime":
            case "time":
            case "timereceived":
                value = format_timestamp(txdata[key]);
                break;
        }
        transtablehtml += "<tr><td><strong>" + key + "</strong></td>" +
            "<td>" + value + "</td></tr>";
    }

    $("#transmodaltable").html(transtablehtml);
    $("#transmodal").modal("show");
}

function showpeer(d) {
    var peerdata = $("#"+d).data("peerdata");
    var peertablehtml=""
    for (var key in peerdata) {
        var value = peerdata[key];
        switch (key) {
            case "conntime":
            case "lastsend":
            case "lastrecv":
                value = format_timestamp(peerdata[key]);
                break;
        }
        peertablehtml += "<tr><td><strong>" + key + "</strong></td>" +
            "<td>" + value + "</td></tr>";
    }

    $("#peermodaltable").html(peertablehtml);
    $("#peermodal").modal("show");
}

function format_timestamp(timestamp) {
    var tsdate = new Date(timestamp*1000);
    var year = tsdate.getFullYear();
    var month = tsdate.getMonth()+1;
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

function hash(s) {
  var hash = 0, i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

$(document).ready(function() {
  update_data();
});
