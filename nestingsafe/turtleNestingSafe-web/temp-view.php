<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta charset='utf-8'>
<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" />
<link rel="stylesheet" href="http://cdn.datatables.net/1.10.10/css/jquery.dataTables.css" />
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.1.0/css/buttons.dataTables.min.css" />
<link rel="stylesheet" type="text/css" href="css/jquery.mobile.min.css" />




<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
        <script type="text/javascript" src="js/jquery.mobile.min.js"></script>
<script src="//cdn.datatables.net/1.10.10/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/buttons/1.1.0/js/dataTables.buttons.min.js"></script>
<script src="//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/pdfmake.min.js"></script>
<script src="//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>
<script src="//cdn.datatables.net/buttons/1.1.0/js/buttons.html5.min.js"></script>
<!-- <script src="https://cdn.datatables.net/buttons/1.1.0/js/dataTables.buttons.min.js"></script>-->
<script src="//cdn.datatables.net/buttons/1.1.0/js/buttons.colVis.min.js"></script>
<script src="js/RFIDNest.js"></script>

<!--<script src="group.js"></script>-->
<script type="text/javascript" charset="utf-8">
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
var tabel;
$(document).ready(function() {
    $('#from').val(new Date().toDateInputValue());

    tabel = $('#hendelser').DataTable( {
        "bProcessing": true,
	"bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bSort": true,
	"bJQueryUI": true,
	"dom": 'Bfrtip',
	"stateSave": true,
        "buttons": [
		"copyHtml5",
		{ extend: 'excelHtml5', title: 'nests', extension: '.xlsx' },
//	        "excelHtml5",
	        "colvis"

        ],
	"oLanguage": {
         "sProcessing": "Henter informasjon. Vennligst vent...",
	 "sLoadingRecords": "Vennligst vent. Henter informasjon....",
	 "sEmptyTable":"Ingen hendelser funnet"
       	},
	        "bInfo": false,
        "bAutoWidth": true,
	"aaSorting": [[ 0, "asc" ]],
	"columnDefs": [
            {
                "targets": [ 1 ],
                "visible": false,
                "searchable": true
            },
            {
                "targets": [4],
                "type": "datetime",
		"format": "YYYY-MM-DD HH:mm"
	    }
	    ],
//        "sAjaxSource": "transactions.php"
        "ajax": "http://test.qrlogistic.com/turtleNestingSafe/ajax/listNests.php?un=dekamer&output=aaData"
    });

    $(function() {
	$( "#tabs" ).tabs({ active: 0 });
	$( "#accordion" ).accordion();
	$( "#accordion >div").css('height', '400');
    });

} );

function updateAll(){
//	tabel.ajax.url( "getLogData.php?readpoint=b8:27:eb:22:dd:03&from="+$('#from').val()+"%2002:00&output=aaData");
	tabel.ajax.reload();
}

setInterval(function() {
updateAll();
},420000);
</script>
</head>
<body>
<div data-role="page" id="tempView">
                        <div data-role="header">
                                <h1>TableView</h1>
                        </div><!-- /header -->

                        <div role="main" id="frontPage" class="ui-content">

<div id="tabs">
	<ul>
		<li><a href="#hendelser-tab">Alle hendelser</a></li>
	</ul>
<div id="hendelse-tab">	
<table cellpadding="0" cellspacing="0" border="0" class="display" id="hendelser" width="100%">
<thead>
        <tr>
            <th>id</th>
	    <th>timestamp</th>
	    <th>RFID</th>
	    <th>sensorID</th>
	    <th>Temp (celcius)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Row 1 Data 1</td>
            <td>Row 1 Data 2</td>
            <td>etc</td>
        </tr>
        <tr>
            <td>Row 2 Data 1</td>
            <td>Row 2 Data 2</td>
            <td>etc</td>
        </tr>
    </tbody>
</table>
</div>
</div>
        </div><!-- /content -->

                        <div data-role="footer" data-position="fixed">
                        </div><!-- /footer -->
        </div><!-- /page -->
 	
</body>
</html>
