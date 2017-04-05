function update_data() {
    $.getJSON(
        "http://localhost:8000/update",
        function(data) {
            // Some basic vaidation
            if (data === undefined ||
                data.info === undefined ||
                data.info.result === undefined ||
                data.rsa === undefined ||
                data.rsa.result === undefined ||
                data.transactions === undefined ||
                data.transactions.result === undefined ||
                data.addresses === undefined ||
                data.addresses.result === undefined ||
                data.peerinfo === undefined ||
                data.peerinfo.result === undefined) {

                console.log("Data Validation failed");
                $("#navstatus").html("Data Error");
                $("#navstatus").removeClass();
                $("#navstatus").addClass("error");
                reqfailed();
            } else {
                console.log("updating page");
                $("#navstatus").removeClass();
                $("#navstatus").addClass("success");
                updatePage(data);
            }
        }
    ) .fail(function() {
        $("#navstatus").html("Request Failed");
        $("#navstatus").removeClass();
        $("#navstatus").addClass("error");
        console.log("request failed");
        reqfailed();
    });

    //setTimeout(update_data,5000);
}

function updatePage(data) {
    // Navbar
    $("#navbalance").html("GRC " + data.info.result.balance.toFixed(3));
    $("#navstatus").html("Connected");

    // Home
    var wallettablehtml="";
    var now=(new Date).getTime()/1000;
    wallettablehtml += "<tr><td><strong>Balance</strong></td><td>" +
                       data.info.result.balance + "</td></tr>";
    wallettablehtml += "<tr><td><strong>Stake</strong></td><td>" +
                       data.info.result.stake + "</td></tr>";
    wallettablehtml += "<tr><td><strong>New Mint</strong></td><td>" +
                       data.info.result.newmint + "</td></tr>";
    wallettablehtml += "<tr><td><strong>Magnitude</strong></td><td>" +
                       data.rsa.result[1]["Magnitude (Last Superblock)"] + "</td></tr>";
    wallettablehtml += "<tr><td><strong>Last Paid Block</strong></td><td>" +
                       data.rsa.result[1]["Last Block Paid"] + "</td></tr>";
    wallettablehtml += "<tr><td><strong>Est Daily Earnings</strong></td><td>" +
                       data.rsa.result[1]["Expected Earnings (Daily)"] + "</td></tr>";
    wallettablehtml += "<tr><td><strong>Tx Fee</strong></td><td>" +
                       data.info.result.paytxfee + "</td></tr>";
    wallettablehtml += "<tr><td><strong>CPID</strong></td><td>" +
                       data.rsa.result[1]["CPID"] + "</td></tr>";
    wallettablehtml += "<tr><td><strong>Unlocked</strong></td><td>" +
                       format_timestamp(data.info.result.unlocked_until) + "</td></tr>";
    $("#wallettable").html(wallettablehtml);
    $("#wallettable").removeClass();

    var clienttablehtml="";
    clienttablehtml += "<tr><td><strong>Version</strong></td><td>" +
                       data.info.result.version + "</td></tr>";
    clienttablehtml += "<tr><td><strong>Connections</strong></td><td>" +
                       data.info.result.connections + "</td></tr>";
    $("#clienttable").html(clienttablehtml);
    $("#clienttable").removeClass();

    var blocktablehtml="";
    pos=data.info.result.difficulty["proof-of-stake"].toFixed(2);
    pow=data.info.result.difficulty["proof-of-work"].toFixed(2);
    blocktablehtml += "<tr><td><strong>Height</strong></td><td>" +
                       data.info.result.blocks + "</td></tr>";
    blocktablehtml += "<tr><td><strong>Proof Stake Difficulty</strong></td><td>" +
                       data.info.result.difficulty["proof-of-stake"].toFixed(2) + "</td></tr>";
    blocktablehtml += "<tr><td><strong>Proof Work Difficulty</strong></td><td>" +
                       data.info.result.difficulty["proof-of-work"].toFixed(2) + "</td></tr>";
    $("#blocktable").html(blocktablehtml);
    $("#blocktable").removeClass();

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

        peershtml += "<tr>";
        peershtml += "<td>" + "<a href=\"#\" onClick='showpeer(\"" +
            hashcode + "\");'>" + peers[row].addr + "</a></td>";
        peershtml += "<td>" + dir + "</td>";
        peershtml += "<td>" + ver + "</td>";
        peershtml += "<td>" + peers[row].pingtime.toFixed(3) + "</td>";

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

function reqfailed() {
    $("#navbalance").html("GRC ???");
    $("#wallettable").html("ERROR");
    $("#wallettable").removeClass();
    $("#wallettable").addClass("error");
    $("#clienttable").html("ERROR");
    $("#clienttable").removeClass();
    $("#clienttable").addClass("error");
    $("#blocktable").html("ERROR");
    $("#blocktable").removeClass();
    $("#blocktable").addClass("error");

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
