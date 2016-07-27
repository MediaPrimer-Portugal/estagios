//o objecto principal que vai encapsular todas as fun��es
primerCORECrypt = 
{
	//calcula a hash MD5 do texto indicado (o resultado � em base64)
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

	//calcula a hash SHA256 do texto indicado (o resultado � em base64)
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

	//encripta o texto indicado usando RSA e chave p�blica fornecida (tanto a chave p�blica como o resultado � em base64)
	rsaEncripta: function(textoEncriptar, rsaXmlPublicKey)
	{
		//se n�o tenho nada pra encriptar
		if (!RSAKey)
			return null;

		//gero o texto a encriptar
		var textoFinalEncriptar = textoEncriptar + "|" + this.hashMD5(textoEncriptar);
		if (!textoFinalEncriptar)
			return null;
		
		//chegando aqui, "basta" encriptar o texto com RSA 
			
		//leio os dados da chave p�blica (que est� em Base64)
		var valueModulus = rsaXmlPublicKey.match("<Modulus>(.+?)</Modulus>")[1];
		var valueExponent = rsaXmlPublicKey.match("<Exponent>(.+?)</Exponent>")[1];
		
		//preparo o "motor" pra encriptar
		var rsaCrypter = new RSAKey();
		rsaCrypter.setPublic(sjcl.codec.hex.fromBits(sjcl.codec.base64.toBits(valueModulus)), sjcl.codec.hex.fromBits(sjcl.codec.base64.toBits(valueExponent)));
		
		//mando encriptar
		var finalCrypt = rsaCrypter.encrypt(textoFinalEncriptar);
			
		//s� falta converter para base64
		return sjcl.codec.base64.fromBits(sjcl.codec.hex.toBits(finalCrypt));
	},
	/*
	pesquisaGeraXml: function(xmlCallback, numChamadas)
	{
		//inicio o XML
		var xmlFinal = '<?xml version=\"1.0\" encoding=\"utf-8\" ?>';
		xmlFinal += '\n<pesquisas>\n';
		
		//se n�o especificaram, assumo 1
		if (!numChamadas)
			numChamadas = 1;

		//para o n�mero de vezes que indicaram
		var i = 0;
		for (i = 0; i <= numChamadas; i++)
		{
			//pe�o o XML da subpesquisa
			subPesquisaXml = xmlCallback();
			if (!subPesquisaXml)
				continue;
				
			//acumulo
			xmlFinal += '\n' + subPesquisaXml + '\n';
		}
		
		//termino o XML e j� t�
		xmlFinal += '\n</pesquisas>';
		return xmlFinal;
	},

	pesquisaGeraXml: function(xmlCallback, numChamadas)
	{
		//inicio o XML
		var xmlFinal = '<?xml version=\"1.0\" encoding=\"utf-8\" ?>';
		xmlFinal += '\n<pesquisas>\n';
		
		//se n�o especificaram, assumo 1
		if (!numChamadas)
			numChamadas = 1;

		//para o n�mero de vezes que indicaram
		var i = 0;
		for (i = 0; i < numChamadas; i++)
		{
			//pe�o o XML da subpesquisa
			subPesquisaXml = xmlCallback();
			if (!subPesquisaXml)
				continue;
				
			//acumulo
			xmlFinal += '\n' + subPesquisaXml + '\n';
		}
		
		//termino o XML e j� t�
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
				
			//elimino o �ltimo ';'
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
				
			//elimino o �ltimo ';'
			elementoSistemas = elementoSistemas.substr(0, elementoSistemas.length - 1);
			
			//guardo no XML
			xmlFinal += '<filtroSistemas>' + elementoSistemas + '</filtroSistemas>\n';
		}
		
		//termino o XML e j� t�
		xmlFinal += '</pesquisaObjectos>';
		return xmlFinal;
	}
	*/
};
