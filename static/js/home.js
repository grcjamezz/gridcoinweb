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
            for (var row=trans.length-1; row >= 0; row--) {
                var account = trans[row].account;
                if (account == "") {
                    account = "(unknown)";
                }
                transhtml += "<tr>";
                transhtml += "<td>" + "<a href=\"/txid/" +
                    trans[row].txid + "\"</a>" +
                    trans[row].txid.substring(0,6) + "</td>";
                transhtml += "<td>" + account + "</td>";
                transhtml += "<td>" + trans[row].amount + "</td>";
                transhtml += "<td>" + trans[row].category + "</td>";
                transhtml += "<td>" + trans[row].confirmations + "</td>";
                transhtml += "<td>" + format_timestamp(trans[row].time) + "</td>";
                transhtml += "</tr>";
            }
            $("#transtable").html(transhtml);
            $("#transtable").removeClass();

            // Peers
            var peershtml="";
            var peers=data.peerinfo.result;
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
                //var lastrecv=now-peers[row].lastrecv;
                //var lastsend=now-peers[row].lastsend;
                peershtml += "<tr>";
                peershtml += "<td>" + dir + "</td>";
                peershtml += "<td>" + ver + "</td>";
                peershtml += "<td>" + peers[row].addr + "</td>";
                peershtml += "<td>" + peers[row].pingtime.toFixed(3) + "</td>";
                peershtml += "<td>" + format_timestamp(peers[row].conntime) + "</td>";
                //peershtml += "<td>" + lastrecv + "</td>";
                //peershtml += "<td>" + lastsend + "</td>";
                //peershtml += "<td>" + format_timestamp(peers[row].lastrecv) + "</td>";
                //peershtml += "<td>" + format_timestamp(peers[row].lastsend) + "</td>";
                peershtml += "</tr>";
            }
            $("#peerstable").html(peershtml);
            $("#peerstable").removeClass();

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
    });

    setTimeout(update_data,5000);
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

$(document).ready(function() {
  update_data();
});
