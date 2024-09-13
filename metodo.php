<?php
require_once "config.php";
header('Content-Type: application/json; charset=utf-8');
$valido = array('success' => false, 'mensaje' => "");

$cx = new mysqli("localhost", "root", "", "res");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];
switch ($action) {
    case 'add':
        $a = $_POST['descr'];
        $b = $_POST['costo'];
        $sql = "INSERT INTO menu VALUES (null,'$a','$b')";
        if ($cx->query($sql)) {
            $valido['success'] = true;
            $valido['mensaje'] = "bien";
        } else {
            $valido['success'] = false;
            $valido['mensaje'] = "ERROR ";
        }
        echo json_encode($valido);
        break;

    case 'cargarM':
        $sql = "SELECT * FROM menu";
        $registro = array('data' => array());
        $res = $cx->query($sql);
        if ($res->num_rows > 0) {
            while ($row = $res->fetch_assoc()) {
                $registro['data'][] = array(
                    'idm' =>$row['idm'],
                    'descr' => $row['descr'],
                    'costo' => $row['costo']
                );
            }
        }
        echo json_encode($registro);
        break;

    case 'cargarO':
        $sql = "SELECT * FROM orden";
                $registro = array('data' => array());
                $res = $cx->query($sql);
                if ($res->num_rows > 0) {
                    while ($row = $res->fetch_assoc()) {
                        $registro['data'][] = array(
                            'ido' =>$row['ido'],
                            'cant' => $row['cant'],
                            'idm' => $row['idm']
                        );
                    }
                }
                echo json_encode($registro);
                break;
                $valido['success'] = false;
                $valido['mensaje'] = "Acción no válida";
                echo json_encode($valido);
        break;
    

case "addO":
    $a = $_POST['idm'];  
    $sql = "SELECT * FROM orden WHERE idm = $a";
    $res = $cx->query($sql);

    if ($res->num_rows > 0) {
        $orden = $res->fetch_assoc();
        $cantidad = $orden['cant'] + 1;
        $sql = "UPDATE orden SET cant = $cantidad WHERE idm = $a";
    } else {
        $sql = "INSERT INTO orden (idm, cant) VALUES ($a, 1)";
    }

    if ($cx->query($sql)) {
        echo json_encode(array('success' => true));
    } else {
        echo json_encode(array('success' => false, 'error' => $cx->error));
    }
    break;
    case 'dellO':
        $ido = $_POST['idm'];  
        $sql = "DELETE FROM orden WHERE ido = $ido";  
        if ($cx->query($sql)) {
            echo json_encode(array('success' => true));
        } else {
            echo json_encode(array('success' => false, 'error' => $cx->error));
        }
        break;

        case 'terO':
            $sql = "DELETE FROM orden";
            if ($cx->query($sql)) {
                echo json_encode(array('success' => true));
            } else {
                echo json_encode(array('success' => false, 'error' => $cx->error));
            }
            break;
        

  
}
}

?>
