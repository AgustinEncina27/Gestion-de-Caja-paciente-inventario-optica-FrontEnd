package com.springboot.backend.optica.dao;



import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.springboot.backend.optica.modelo.Paciente;

public interface IPacienteDao extends JpaRepository<Paciente, Long> {
	
	public Page<Paciente> findByNombreCompleto (String nombreCompleto, Pageable pageable);
	
	public Page<Paciente> findByDocumento (String documento, Pageable pageable);
	
    Optional<Paciente> findByFicha(Long ficha);

}
