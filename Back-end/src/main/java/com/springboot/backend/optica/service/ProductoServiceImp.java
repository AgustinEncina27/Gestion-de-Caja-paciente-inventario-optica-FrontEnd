package com.springboot.backend.optica.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.backend.optica.dao.ILocalDao;
import com.springboot.backend.optica.dao.IProductoDao;
import com.springboot.backend.optica.dao.IProductoLocalDao;
import com.springboot.backend.optica.modelo.Local;
import com.springboot.backend.optica.modelo.Producto;
import com.springboot.backend.optica.modelo.ProductoLocal;

@Service
public class ProductoServiceImp implements IProductoService {
	
	@Autowired
	private IProductoDao productoDao;
	
	@Autowired
	private IProductoLocalDao productoLocalRepository; 
	
	@Autowired
	private ILocalDao localRepository; 
		
	@Override
	@Transactional(readOnly = true)
	public List<Producto> findAllProducto() {
		return productoDao.findAll();
	}
	
	@Override
	@Transactional(readOnly = true)
	public Page<Producto> findAllProducto(Pageable pageable) {
		Page<Producto> productos = productoDao.findAllProducto(pageable);
	    // Cargar relaciones de productoLocales manualmente
	    productos.getContent().forEach(producto -> producto.getProductoLocales().size());
	    return productos;
	}
	
	@Override
	@Transactional(readOnly = true)
    public Optional<Producto> findByModelo(String modelo) {
        return productoDao.findByModelo(modelo);
    }

	@Override
	@Transactional(readOnly = true)
	public Page<Producto> findByGeneroAndMarcaAndCategoria(String genero, Long marca, Long categoria, Pageable pageable) {
		return productoDao.findByGeneroAndMarcaAndCategoria(genero,marca,categoria,pageable);
	}
	
	@Override
	@Transactional(readOnly = true)
	public Producto findById(Long id) {
		return productoDao.findById(id).orElse(null);
	}
	
	@Override
	@Transactional(readOnly = true)
	public Producto findBySimbolo(String simbolo) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	@Transactional(readOnly = true)
	public Integer getStockByLocal(Long productoId, Long localId) {
	    Optional<ProductoLocal> productoLocal = productoLocalRepository.findByProductoIdAndLocalId(productoId, localId);
	    return productoLocal.map(ProductoLocal::getStock).orElse(null);
	}

	@Override
	@Transactional
	public boolean setStockByLocal(Long productoId, Long localId, Integer stock) {
	    Optional<ProductoLocal> productoLocal = productoLocalRepository.findByProductoIdAndLocalId(productoId, localId);
	    if (productoLocal.isPresent()) {
	        ProductoLocal existing = productoLocal.get();
	        existing.setStock(stock);
	        productoLocalRepository.save(existing);
	        return true;
	    } else {
	        Optional<Producto> producto = productoDao.findById(productoId);
	        Optional<Local> local = localRepository.findById(localId);
	        if (producto.isPresent() && local.isPresent()) {
	            ProductoLocal newProductoLocal = new ProductoLocal();
	            newProductoLocal.setProducto(producto.get());
	            newProductoLocal.setLocal(local.get());
	            newProductoLocal.setStock(stock);
	            productoLocalRepository.save(newProductoLocal);
	            return true;
	        }
	    }
	    return false;
	}

	@Override
	@Transactional
	public Producto save(Producto producto) {
		return productoDao.save(producto);
	}

	@Override
	@Transactional
	public void deleteNote(Long id) {
		Producto note = productoDao.findById(id).get();
		productoDao.delete(note);
	}

}
