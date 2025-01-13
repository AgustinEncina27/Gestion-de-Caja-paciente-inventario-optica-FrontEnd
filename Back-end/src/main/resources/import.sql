INSERT INTO categorias (nombre) VALUES ('Gafas de Sol');
INSERT INTO categorias (nombre) VALUES ('Receta');
INSERT INTO categorias (nombre) VALUES ('Accesorios');

INSERT INTO marcas (nombre) VALUES ('Belong');
INSERT INTO marcas (nombre) VALUES ('Blitz');
INSERT INTO marcas (nombre) VALUES ('Carolina Emanuel');
INSERT INTO marcas (nombre) VALUES ('Mariana Arias');
INSERT INTO marcas (nombre) VALUES ('Mito');
INSERT INTO marcas (nombre) VALUES ('Mua');
INSERT INTO marcas (nombre) VALUES ('Pierri Cardin');
INSERT INTO marcas (nombre) VALUES ('Rusty');
INSERT INTO marcas (nombre) VALUES ('Tascanj');
INSERT INTO marcas (nombre) VALUES ('Vulk');
INSERT INTO marcas (nombre) VALUES ('Westbury');

INSERT INTO locales (nombre,direccion) VALUES ('La Cruz','Entre Ayacucho y Zuzini');
INSERT INTO locales (nombre,direccion) VALUES ('Alvear','Herrera');

INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (1, 'Juan Perez',20, 'Av. Siempre Viva 123', '1112345678', 'Hombre', '1.5', '30123456', 'juan.perez@email.com', 'Dr. Gomez', '2025-01-15', '2025-01-01', '2025-01-03',1);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (2, 'Maria Garcia',19, 'Calle Falsa 456', '2223456789', 'Mujer', '2.0', '30123457', 'maria.garcia@email.com', 'Dra. Martinez', '2025-02-10', '2025-01-02', '2025-01-04',2);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (3, 'Carlos Lopez',18, 'San Martin 789', '3334567890', 'Hombre', '1.75', '30123458', 'carlos.lopez@email.com', 'Dr. Ruiz', '2025-03-20', '2025-01-03', '2025-01-05',1);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (4, 'Ana Fernandez',17, 'Belgrano 123', '4445678901', 'Mujer', '1.25', '30123459', 'ana.fernandez@email.com', 'Dra. Diaz', '2025-04-25', '2025-01-04', '2025-01-06',2);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (5, 'Pedro Gomez',16, 'Corrientes 456', '5556789012', 'Hombre', '2.25', '30123460', 'pedro.gomez@email.com', 'Dr. Suarez', '2025-05-15', '2025-01-05', '2025-01-07',1);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (6, 'Laura Martinez',15, 'Mitre 789', '6667890123', 'Mujer', '1.0', '30123461', 'laura.martinez@email.com', 'Dra. Lopez', '2025-06-20', '2025-01-06', '2025-01-08',2);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (7, 'Jose Alvarez',14, 'Av. Rivadavia 123', '7778901234', 'Hombre', '1.5', '30123462', 'jose.alvarez@email.com', 'Dr. Fernandez', '2025-07-10', '2025-01-07', '2025-01-09',1);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (8, 'Sofia Ramirez',13, 'Moreno 456', '8889012345', 'X', '2.0', '30123463', 'sofia.ramirez@email.com', 'Dra. Garcia', '2025-08-15', '2025-01-08', '2025-01-10',2);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (9, 'Luis Gonzalez',12, 'Laprida 789', '9990123456', 'X', '1.25', '30123464', 'luis.gonzalez@email.com', 'Dr. Sanchez', '2025-09-05', '2025-01-09', '2025-01-11',1);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (10, 'Marta Diaz',11, 'Colon 123', '1012345678', 'Mujer', '1.75', '30123465', 'marta.diaz@email.com', 'Dra. Alvarez', '2025-10-10', '2025-01-10', '2025-01-12',2);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (11, 'Diego Torres',10, 'San Juan 456', '1123456789', 'Hombre', '1.5', '30123466', 'diego.torres@email.com', 'Dr. Castro', '2025-11-15', '2025-01-11', '2025-01-13',1);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (12, 'Valeria Mendoza',9, 'Santa Fe 789', '1234567890', 'Mujer', '2.25', '30123467', 'valeria.mendoza@email.com', 'Dra. Ramirez', '2025-12-05', '2025-01-12', '2025-01-14',2);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (13, 'Luciana Perez',8, 'Av. Libertador 123', '1312345678', 'Mujer', '2.0', '30123468', 'luciana.perez@email.com', 'Dra. Gonzalez', '2025-12-20', '2025-01-13', '2025-01-15',1);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (14, 'Andres Suarez',7, 'Cordoba 456', '1412345678', 'Hombre', '1.25', '30123469', 'andres.suarez@email.com', 'Dr. Diaz', '2025-01-20', '2025-01-14', '2025-01-16',2);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (15, 'Natalia Herrera',6, 'Rosario 789', '1512345678', 'Mujer', '1.5', '30123470', 'natalia.herrera@email.com', 'Dra. Fernandez', '2025-02-25', '2025-01-15', '2025-01-17',1);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (16, 'Sebastian Rios',5, 'Av. Belgrano 123', '1612345678', 'Hombre', '1.75', '30123471', 'sebastian.rios@email.com', 'Dr. Lopez', '2025-03-15', '2025-01-16', '2025-01-18',1);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (17, 'Gabriela Castro',4, 'Mitre 456', '1712345678', 'Mujer', '2.5', '30123472', 'gabriela.castro@email.com', 'Dra. Suarez', '2025-04-10', '2025-01-17', '2025-01-19',2);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (18, 'Fernando Medina',3, 'Rivadavia 789', '1812345678', 'Hombre', '1.0', '30123473', 'fernando.medina@email.com', 'Dr. Gomez', '2025-05-25', '2025-01-18', '2025-01-20',1);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (19, 'Patricia Blanco',2, 'Moreno 123', '1912345678', 'Mujer', '2.25', '30123474', 'patricia.blanco@email.com', 'Dra. Martinez', '2025-06-15', '2025-01-19', '2025-01-21',2);
INSERT INTO pacientes (id, nombre_completo,ficha, direccion, celular, genero, graduacion, documento, correo, medico, fecha_de_control, creado_en, ultima_actualizacion,local_id) VALUES (20, 'Miguel Herrera',1, 'San Martin 456', '2012345678', 'Hombre', '1.75', '30123475', 'miguel.herrera@email.com', 'Dr. Ruiz', '2025-07-10', '2025-01-20', '2025-01-22',1);

INSERT INTO metodos_pago (nombre,impuesto) VALUES ('Efectivo',0);
INSERT INTO metodos_pago (nombre,impuesto) VALUES ('Tarjeta de Crédito',10);
INSERT INTO metodos_pago (nombre,impuesto) VALUES ('Tarjeta de Débito',10);



INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (1, 'Modelo A', 'Lentes de sol polarizados', 1200.00, 800.00, 'Plástico', 'Unisex', '2025-01-01', '2025-01-15',1);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (2, 'Modelo B', 'Lentes de lectura', 800.00, 500.00, 'Metal', 'Mujer', '2025-01-02', '2025-01-16',2);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (3, 'Modelo C', 'Lentes con filtro azul', 1500.00, 1000.00, 'Acetato', 'Hombre', '2025-01-03', '2025-01-17',3);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (4, 'Modelo D', 'Lentes deportivos', 1800.00, 1200.00, 'Policarbonato', 'Unisex', '2025-01-04', '2025-01-18',4);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (5, 'Modelo E', 'Lentes de sol vintage', 2000.00, 1500.00, 'Metal', 'Mujer', '2025-01-05', '2025-01-19',5);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (6, 'Modelo F', 'Gafas premium.', 3000.00, 2500.00, 'Acetato', 'Mujer', '2025-01-06', '2025-01-07',1);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (7, 'Modelo G', 'Diseño retro.', 1300.00, 1000.00, 'Metal', 'Unisex', '2025-01-07', '2025-01-08',2);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (8, 'Modelo H', 'Lentes con protección UV.', 1900.00, 1500.00, 'Plástico', 'Hombre', '2025-01-08', '2025-01-09',3);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (9, 'Modelo I', 'Estilo clásico.', 2200.00, 1800.00, 'Policarbonato', 'Mujer', '2025-01-09', '2025-01-10',4);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (10, 'Modelo J', 'Ideal para deportes.', 2700.00, 2200.00, 'Acetato', 'Unisex', '2025-01-10', '2025-01-11',5);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (11, 'Modelo K', 'Confort y estilo.', 2400.00, 2000.00, 'Metal', 'Hombre', '2025-01-11', '2025-01-12',1);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (12, 'Modelo L', 'Lentes recetados.', 1800.00, 1400.00, 'Plástico', 'Mujer', '2025-01-12', '2025-01-13',2);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (13, 'Modelo M', 'Estilo vanguardista.', 3200.00, 2700.00, 'Policarbonato', 'Unisex', '2025-01-13', '2025-01-14',3);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (14, 'Modelo N', 'Para niños.', 1200.00, 900.00, 'Metal', 'Unisex', '2025-01-14', '2025-01-15',4);
INSERT INTO productos (id, modelo, descripcion, precio, costo, material, genero, creado_en, ultima_actualizacion,marca_id) VALUES (15, 'Modelo O', 'Lentes polarizados.', 2000.00, 1600.00, 'Plástico', 'Hombre', '2025-01-15', '2025-01-16',5);

-- Inserts para la tabla producto_local
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (1, 1, 0);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (1, 2, 1);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (2, 2, 1);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (2, 1, 2);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (3, 1, 20);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (4, 2, 40);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (5, 1, 60);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (6, 2, 35);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (7, 1, 60);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (8, 2, 50);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (9, 1, 45);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (10, 2, 55);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (11, 1, 50);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (12, 2, 65);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (13, 1, 30);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (14, 2, 20);
INSERT INTO producto_local (producto_id, local_id, stock) VALUES (15, 1, 45);

INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (1, 1); -- Gafas de Sol
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (2, 2); -- Receta
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (3, 2); -- Receta
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (4, 1); -- Gafas de Sol
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (5, 1); -- Gafas de Sol
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (6, 1); -- Gafas de Sol
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (7, 2); -- Receta
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (8, 2); -- Receta
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (9, 1); -- Gafas de Sol
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (10, 1); -- Gafas de Sol
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (11, 1); -- Gafas de Sol
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (12, 2); -- Receta
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (13, 2); -- Receta
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (14, 1); -- Gafas de Sol
INSERT INTO producto_categoria (producto_id, categoria_id) VALUES (15, 1); -- Gafas de Sol


INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (1, 'ENTRADA', '2025-01-15', 1500.00, 1500.00, 'Venta de lentes de sol', 1, 1,1);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (2, 'SALIDA', '2025-01-20', 300.00,300.00, 'Compra de accesorios', 2, 2,2);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (3, 'ENTRADA', '2025-01-25', 2500.00,2500.00, 'Venta de lentes con receta', 3, 1,1);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (4, 'SALIDA', '2025-02-01', 200.00,200.00, 'Compra de estuches', 4, 3,2);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (5, 'ENTRADA', '2025-02-10', 1800.00,1800.00, 'Venta de lentes de sol', 5, 1,1);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (6, 'SALIDA', '2025-01-20', 1300.00,1300.00, 'Compra de nuevos productos.', 6, 1,2);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (7, 'ENTRADA', '2025-01-21', 1900.00,1900.00, 'Venta de gafas deportivas.', 7, 2,1);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (8, 'SALIDA', '2025-01-22', 2200.00,2200.00, 'Compra de insumos médicos.', 8, 3,2);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (11, 'ENTRADA', '2025-01-25', 3200.00,3200.00, 'Venta de lentes premium.', 11, 1,1);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (12, 'SALIDA', '2025-01-26', 1200.00,1200.00, 'Reemplazo de accesorios.', 12, 2,2);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (13, 'ENTRADA', '2025-01-27', 2000.00,2000.00, 'Venta de gafas casuales.', 13, 3,1);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (14, 'SALIDA', '2025-01-28', 1800.00,1800.00, 'Compra de nuevos modelos.', 14, 3,2);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (15, 'ENTRADA', '2025-01-29', 1500.00,1500.00, 'Venta de lentes para niños.', 15, 2,1);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (9, 'ENTRADA', '2025-01-23', 2500.00,2500.00, 'Venta de lentes polarizados.', 9, 1,2);
INSERT INTO movimientos (id, tipo_movimiento, fecha, total,total_impuesto, descripcion, paciente_id, metodo_pago_id,local_id) VALUES (10, 'SALIDA', '2025-01-24', 2400.00,2400.00, 'Devolución de productos.', 10, 3,1);

-- Detalles para Movimiento 1
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (1, 2, 750.00, 1500.00, 1, 1);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (2, 1, 750.00, 750.00, 1, 2);

-- Detalles para Movimiento 2
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (3, 1, 1200.00, 1200.00, 2, 3);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (4, 3, 400.00, 1200.00, 2, 4);

-- Detalles para Movimiento 3
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (5, 4, 500.00, 2000.00, 3, 5);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (6, 2, 1000.00, 2000.00, 3, 6);

-- Detalles para Movimiento 4
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (7, 2, 700.00, 1400.00, 4, 7);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (8, 4, 350.00, 1400.00, 4, 8);

-- Detalles para Movimiento 5
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (9, 5, 340.00, 1700.00, 5, 9);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (10, 2, 850.00, 1700.00, 5, 10);

-- Detalles para Movimiento 6
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (11, 3, 433.33, 1300.00, 6, 11);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (12, 1, 1300.00, 1300.00, 6, 12);

-- Detalles para Movimiento 7
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (13, 2, 950.00, 1900.00, 7, 13);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (14, 1, 1900.00, 1900.00, 7, 14);

-- Detalles para Movimiento 8
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (15, 1, 2200.00, 2200.00, 8, 15);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (16, 2, 1100.00, 2200.00, 8, 1);

-- Detalles para Movimiento 9
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (17, 3, 833.33, 2500.00, 9, 2);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (18, 5, 500.00, 2500.00, 9, 3);
-- Detalles para Movimiento 10
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (19, 4, 600.00, 2400.00, 10, 4);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (20, 6, 400.00, 2400.00, 10, 5);

-- Detalles para Movimiento 11
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (21, 2, 1600.00, 3200.00, 11, 6);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (22, 1, 3200.00, 3200.00, 11, 7);

-- Detalles para Movimiento 12
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (23, 2, 600.00, 1200.00, 12, 8);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (24, 3, 400.00, 1200.00, 12, 9);

-- Detalles para Movimiento 13
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (25, 4, 500.00, 2000.00, 13, 10);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (26, 2, 1000.00, 2000.00, 13, 11);

-- Detalles para Movimiento 14
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (27, 2, 900.00, 1800.00, 14, 12);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (28, 3, 600.00, 1800.00, 14, 13);

-- Detalles para Movimiento 15
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (29, 1, 1500.00, 1500.00, 15, 14);
INSERT INTO detalle_movimientos (id, cantidad, precio_unitario, subtotal, movimiento_id, producto_id) VALUES (30, 2, 750.00, 1500.00, 15, 15);

INSERT INTO `users` (username,password,enabled) VALUES ('admin','$2a$12$sjKS18Ja7I1pnQEPEtpxKOMbtv4fNHmTMhjivroHnX4CBceJ70lo2',1); 

INSERT INTO `roles` (name) VALUES ('ROLE_ADMIN'); 

INSERT INTO `users_roles` (user_id,role_id) VALUES (1,1); 
