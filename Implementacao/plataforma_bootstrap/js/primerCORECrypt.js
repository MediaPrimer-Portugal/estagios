//o objecto principal que vai encapsular todas as funções
primerCORECrypt = 
{
	//calcula a hash MD5 do texto indicado (o resultado é em base64)
	hashMD5: function(texto)
	{
		//tem de haver suporte
		if (!Crypto || !Crypto.MD5)
			return null;
			
		//mando fazer a hash
		var hashPass = Crypto.MD5(texto);
		
		//e converto para base64
		return sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(hashPass));
	},

	//calcula a hash SHA256 do texto indicado (o resultado é em base64)
	hashSHA256: function(texto)
	{
		//tem de haver suporte
		if (!sjcl.hash.sha256)
			return null;
			
		//mando fazer a hash
		var hashPass = sjcl.hash.sha256.hash(texto);
		
		//e converto para base64
		return sjcl.codec.base64.fromBits(hashPass);
	},

	//encripta o texto indicado usando RSA e chave pública fornecida (tanto a chave pública como o resultado é em base64)
	rsaEncripta: function(textoEncriptar, rsaXmlPublicKey)
	{
		//se não tenho nada pra encriptar
		if (!RSAKey)
			return null;

		//gero o texto a encriptar
		var textoFinalEncriptar = textoEncriptar + "|" + this.hashMD5(textoEncriptar);
		if (!textoFinalEncriptar)
			return null;
		
		//chegando aqui, "basta" encriptar o texto com RSA 
			
		//leio os dados da chave pública (que está em Base64)
		var valueModulus = rsaXmlPublicKey.match("<Modulus>(.+?)</Modulus>")[1];
		var valueExponent = rsaXmlPublicKey.match("<Exponent>(.+?)</Exponent>")[1];
		
		//preparo o "motor" pra encriptar
		var rsaCrypter = new RSAKey();
		rsaCrypter.setPublic(sjcl.codec.hex.fromBits(sjcl.codec.base64.toBits(valueModulus)), sjcl.codec.hex.fromBits(sjcl.codec.base64.toBits(valueExponent)));
		
		//mando encriptar
		var finalCrypt = rsaCrypter.encrypt(textoFinalEncriptar);
			
		//só falta converter para base64
		return sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(finalCrypt));
	},
	/*
	pesquisaGeraXml: function(xmlCallback, numChamadas)
	{
		//inicio o XML
		var xmlFinal = '<?xml version=\"1.0\" encoding=\"utf-8\" ?>';
		xmlFinal += '\n<pesquisas>\n';
		
		//se não especificaram, assumo 1
		if (!numChamadas)
			numChamadas = 1;

		//para o número de vezes que indicaram
		var i = 0;
		for (i = 0; i <= numChamadas; i++)
		{
			//peço o XML da subpesquisa
			subPesquisaXml = xmlCallback();
			if (!subPesquisaXml)
				continue;
				
			//acumulo
			xmlFinal += '\n' + subPesquisaXml + '\n';
		}
		
		//termino o XML e já tá
		xmlFinal += '\n</pesquisas>';
		return xmlFinal;
	},

	pesquisaGeraXml: function(xmlCallback, numChamadas)
	{
		//inicio o XML
		var xmlFinal = '<?xml version=\"1.0\" encoding=\"utf-8\" ?>';
		xmlFinal += '\n<pesquisas>\n';
		
		//se não especificaram, assumo 1
		if (!numChamadas)
			numChamadas = 1;

		//para o número de vezes que indicaram
		var i = 0;
		for (i = 0; i < numChamadas; i++)
		{
			//peço o XML da subpesquisa
			subPesquisaXml = xmlCallback();
			if (!subPesquisaXml)
				continue;
				
			//acumulo
			xmlFinal += '\n' + subPesquisaXml + '\n';
		}
		
		//termino o XML e já tá
		xmlFinal += '\n</pesquisas>';
		return xmlFinal;
	},

	pesquisaObjectosGeraXml: function(pesquisaID, listaClassesIDs, listaSistemasIDs)
	{
		//inicio o XML
		var xmlFinal = '\<pesquisaObjectos id="' + pesquisaID + '">\n';
		
		//se tiver classes
		if (listaClassesIDs && (listaClassesIDs.length > 0))
		{
			//onde vou acumular os IDs
			var elementoClasses = '';
			
			//para cada classe
			var i = 0;
			for (i = 0; i < listaClassesIDs.length; i++)
				elementoClasses += listaClassesIDs[i] + ';';
				
			//elimino o último ';'
			elementoClasses = elementoClasses.substr(0, elementoClasses.length - 1);
			
			//guardo no XML
			xmlFinal += '<filtroClasses>' + elementoClasses + '</filtroClasses>\n';
		}
		
		//se tiver sistemas
		if (listaSistemasIDs && (listaSistemasIDs.length > 0))
		{
			//onde vou acumular os IDs
			var elementoSistemas = '';
			
			//para cada sistema
			var i = 0;
			for (i = 0; i < listaSistemasIDs.length; i++)
				elementoSistemas += listaSistemasIDs[i] + ';';
				
			//elimino o último ';'
			elementoSistemas = elementoSistemas.substr(0, elementoSistemas.length - 1);
			
			//guardo no XML
			xmlFinal += '<filtroSistemas>' + elementoSistemas + '</filtroSistemas>\n';
		}
		
		//termino o XML e já tá
		xmlFinal += '</pesquisaObjectos>';
		return xmlFinal;
	}
	*/
};
