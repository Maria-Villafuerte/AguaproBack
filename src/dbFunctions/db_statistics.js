import conn from '../conn.js'

// VENTAS EN UN PERIODO
export async function getSales (fechaInicio, fechaFin) {
    try {
        const result = await conn.query(`SELECT created_date, monto_total, id_pedido, id_cliente FROM Factura
        WHERE created_date BETWEEN $1 AND $2`, 
        [fechaInicio + ' 00:00:00', fechaFin + ' 23:59:59']);
        return result.rows.length > 0 ? result.rows : 'No sales found.'
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
}

// TOTAL DE VENTAS EN UN PERIODO
export async function getTotalSales(fechaInicio, fechaFin) {
    try {
        const result = await conn.query(`
            SELECT SUM(monto_total) as total_ventas
            FROM Factura
            WHERE created_date BETWEEN $1 AND $2`, 
            [fechaInicio + ' 00:00:00', fechaFin + ' 23:59:59']);
        return result.rows.length > 0 ? result.rows[0].total_ventas : 'No sales found.';
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
}

// 5 PRODUCTOS MÁS PEDIDOS
export async function getTopProducts (fechaInicio, fechaFin) {
    try {
        const result = await conn.query(`SELECT p.nombre, AVG(r.cantidad)
            FROM factura f
            JOIN pedidos s ON s.id_pedido = f.id_pedido
            JOIN recuento r ON r.pedido_fk = s.id_pedido
            JOIN productos p ON p.id_producto = r.producto_fk
            WHERE created_date BETWEEN $1 AND $2
            GROUP BY p.id_producto
            ORDER BY AVG(r.cantidad) DESC
            LIMIT 5`, [fechaInicio + ' 00:00:00', fechaFin + ' 23:59:59']);
        return result.rows.length > 0 ? result.rows : 'No sales found.'
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
}

// 5 CLIENTES CON MÁS PEDIDOS
export async function getTopClients(fechaInicio, fechaFin) {
    try {
        const result = await conn.query(`
            SELECT id_cliente, c.nombre, COUNT(id_pedido) as total_pedidos
            FROM Factura f NATURAL JOIN clientes c
            WHERE created_date BETWEEN $1 AND $2
            GROUP BY id_cliente, c.nombre
            ORDER BY total_pedidos DESC
            LIMIT 5`, 
            [fechaInicio + ' 00:00:00', fechaFin + ' 23:59:59']);
        return result.rows.length > 0 ? result.rows : 'No data found.';
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
}

// VENTAS AL DÍA
export async function getDailySales(fechaInicio, fechaFin) {
    try {
        const result = await conn.query(`
            SELECT DATE(created_date) as fecha, SUM(monto_total) as total_ventas
            FROM Factura
            WHERE created_date BETWEEN $1 AND $2
            GROUP BY DATE(created_date)
            ORDER BY fecha`, 
            [fechaInicio + ' 00:00:00', fechaFin + ' 23:59:59']);
        return result.rows.length > 0 ? result.rows : 'No sales found.';
    } catch (error) {
        console.error('Error en la consulta SQL:', error);
        throw error;
    }
}

