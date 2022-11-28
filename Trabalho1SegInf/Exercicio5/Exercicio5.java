package Trabalho1.Exercicio5;

import java.io.*;

import java.security.MessageDigest;


public class Exercicio5 {

	public static void main(String[] args) throws Exception{

		File file = new File(args[1]);
		FileInputStream file1 = new FileInputStream(file);
		byte[] arr = new byte[(int)file.length()];
		file1.read(arr);
		file1.close();

		
		MessageDigest messageDigest = MessageDigest.getInstance(args[0]);
		byte[] hash = messageDigest.digest(arr);

		prettyPrint(hash);
	}


	
	private static void prettyPrint(byte[] h) {
		for (byte b : h) {
			System.out.printf("%02x", b);
		}
		System.out.println();
	}
}
