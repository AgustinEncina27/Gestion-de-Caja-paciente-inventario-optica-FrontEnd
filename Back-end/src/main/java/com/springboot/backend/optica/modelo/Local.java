package com.springboot.backend.optica.modelo;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
@Entity
@Table(name="locales")
public class Local implements Serializable {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@NotEmpty
	@Size(max=40,message = "the maximum is 40 characters")
	@Column(nullable=false)
	private String nombre;
	
	private String direccion;
	
	@OneToMany(mappedBy = "local", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ProductoLocal> productoLocales;
	
	private static final long serialVersionUID = 1L;
	
}
