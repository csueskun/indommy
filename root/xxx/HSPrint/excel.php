<?php
$filename = "Inventario_".date("Y-m-d").".xls";
header('Content-Type: application/vnd.ms-excel charset=iso-8859-1');
header('Content-Disposition: attachment; filename="'.$filename.'"');
$data = $_POST['data'];
$data = json_decode($data);
?>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1 " />
</head>
<body>
    <table border="1" cellpadding="2" cellspacing="0" width="100%">
        <thead>
        <tr>
            <th>NOMBRE</th>
            <th>TIPO</th>
            <th>BODEGA</th>
            <th>ACTUALIZADO</th>
            <th>EXISTENCIA</th>
            <th>UNIDAD</th>
            <th>MAXIMA</th>
            <th>MINIMA</th>
        </tr>
        </thead>
        <tbody>
        <?php foreach ($data as $row){ ?>
            <tr>
                <td><?= $row[0] ?></td>
                <td><?= $row[1] ?></td>
                <td><?= $row[2] ?></td>
                <td><?= $row[3] ?></td>
                <td><?= $row[4] ?></td>
                <td><?= $row[5] ?></td>
                <td><?= $row[6] ?></td>
                <td><?= $row[7] ?></td>
            </tr>
        <?php } ?>
        </tbody>
    </table>
</body>
</html>
