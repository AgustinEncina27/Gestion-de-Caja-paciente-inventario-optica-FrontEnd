package com.springboot.backend.optica.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.backend.optica.dao.IMetodoPagoDao;
import com.springboot.backend.optica.dao.IMovimientoDao;
import com.springboot.backend.optica.modelo.MetodoPago;
import com.springboot.backend.optica.modelo.Movimiento;

@Service
public class MovimientoServiceImpl implements IMovimientoService {

    @Autowired
    private IMovimientoDao movimientoRepository;
    
    @Autowired
    private IMetodoPagoDao metodoPagoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Movimiento> findAll() {
        return movimientoRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Movimiento> filtrarMovimientos(Long idLocal, String tipoMovimiento, Long nroFicha, LocalDate fecha, String metodoPago, Pageable pageable) {
        if(idLocal== null || idLocal==0)idLocal=null;
    	
    	return movimientoRepository.filtrarMovimientos(idLocal, tipoMovimiento, nroFicha, fecha, metodoPago, pageable);
    }
    
    @Override
	@Transactional(readOnly = true)
	public Page<Movimiento> findAllMovimiento(Pageable pageable) {
		return movimientoRepository.findAll(pageable);
	}
    
    @Override
    @Transactional(readOnly = true)
    public Page<Movimiento> findByLocalIdPaginated(Long idLocal, Pageable pageable) {
        return movimientoRepository.findByLocalId(idLocal, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Map<String, Double> calcularTotales(Long idLocal) {
        // Obtener todos los métodos de pago
        List<MetodoPago> metodosPago = metodoPagoRepository.findAll();
        Map<String, Double> totales = new HashMap<>();

        // Inicializar los totales en 0 para cada método de pago
        for (MetodoPago metodoPago : metodosPago) {
            totales.put(metodoPago.getNombre(), 0.0);
        }

        // Obtener movimientos según el local seleccionado
        List<Movimiento> movimientos;
        if (idLocal == 0) {
            movimientos = movimientoRepository.findAll();
        } else {
            movimientos = movimientoRepository.findByLocalId(idLocal);
        }

        // Calcular los totales para cada método de pago teniendo en cuenta el tipo de movimiento
        for (Movimiento movimiento : movimientos) {
            String metodoPagoNombre = movimiento.getMetodoPago().getNombre();
            if (totales.containsKey(metodoPagoNombre)) {
                double totalActual = totales.get(metodoPagoNombre);
                
                // Sumar o restar según el tipo de movimiento
                if ("ENTRADA".equalsIgnoreCase(movimiento.getTipoMovimiento())) {
                    totalActual += movimiento.getTotal();
                } else if ("SALIDA".equalsIgnoreCase(movimiento.getTipoMovimiento())) {
                    totalActual -= movimiento.getTotal();
                }
                
                totales.put(metodoPagoNombre, totalActual);
            }
        }

        return totales;
    }

    @Override
    @Transactional(readOnly = true)
    public Movimiento findById(Long id) {
        Optional<Movimiento> result = movimientoRepository.findById(id);
        return result.orElse(null);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Movimiento> findByTipoMovimiento(String tipo, Pageable pageable) {
        return movimientoRepository.findByTipoMovimiento(tipo, pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<Movimiento> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin, Pageable pageable) {
        return movimientoRepository.findByFechaBetween(fechaInicio, fechaFin, pageable);
    }

    @Override
	@Transactional
    public Movimiento save(Movimiento movimiento) {
        return movimientoRepository.save(movimiento);
    }

    @Override
	@Transactional
    public void delete(Long id) {
        movimientoRepository.deleteById(id);
    }
}
