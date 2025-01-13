package com.springboot.backend.optica.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.springboot.backend.optica.dao.IMarcaDao;
import com.springboot.backend.optica.modelo.Marca;

@Service
public class MarcaServiceImp implements IMarcaService {
	
	@Autowired
	private IMarcaDao marcaDao;

	@Override
	@Transactional(readOnly = true)
	public List<Marca> findAllMarca() {
		return (List<Marca>) marcaDao.findAll();
	}

	@Override
	@Transactional(readOnly = true)
	public Marca findById(Long id) {
		return marcaDao.findById(id).orElse(null);
	}

	@Override
	@Transactional
	public Marca save(Marca marca) {
		return marcaDao.save(marca);
	}

	@Override
	@Transactional
	public void deleteMarca(Long id) {
		Marca marcaAEliminar=marcaDao.findById(id).orElse(null);
		marcaDao.delete(marcaAEliminar);
	}

	

}
