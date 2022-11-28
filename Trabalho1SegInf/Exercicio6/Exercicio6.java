package Trabalho1.Exercicio6;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import org.apache.commons.codec.binary.Base64InputStream;
import org.apache.commons.codec.binary.Base64OutputStream;

import java.security.cert.X509Certificate;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Enumeration;


public class Exercicio6 {
    public static void main(String[] args) throws Exception{
        Cipher cipher = Cipher.getInstance("AES");
        Cipher c = Cipher.getInstance("RSA", "SunJCE");

        switch (args[0]) {
            case "-enc" -> enc(args[1], args[2], cipher, c);
            case "-dec" -> dec(args[1], args[2], args[3], cipher, c);
            default -> throw new IllegalArgumentException("Illegal argument!");
        }
    }


    private static void prettyPrint(byte[] h) {
        for (byte b : h) {
            System.out.printf("%02x", b);
        }
        System.out.println();
    }

    private static void prettyWriteFile(byte[] h, String file) throws IOException {
        FileOutputStream baseOut = new FileOutputStream(file);
        Base64OutputStream out = new Base64OutputStream(baseOut);
        out.write(h);
        out.close();
    }

    private static byte[] prettyReadFile(String file) throws IOException {
        FileInputStream baseIn = new FileInputStream(file);
        Base64InputStream in = new Base64InputStream(baseIn);
        return in.readAllBytes();
    }

    private static void enc(String messageFilePath, String certificateFilePath, Cipher cipher, Cipher c) throws IOException, CertificateException, NoSuchAlgorithmException, NoSuchPaddingException, IllegalBlockSizeException, BadPaddingException, InvalidKeyException, NoSuchProviderException, InvalidKeySpecException, KeyStoreException, UnrecoverableKeyException {
        /*
         * MessageFilePath is the path to the message
         * */
        File file = new File(messageFilePath);
        FileInputStream file1 = new FileInputStream(file);
        byte[] arr = new byte[(int)file.length()];
        file1.read(arr);
        file1.close();

        /*
         * CertificateFilePath is the path to the certificate's File
         * */

        File certificate = new File(certificateFilePath);
        FileInputStream fis = new FileInputStream(certificate);
        CertificateFactory cf = CertificateFactory.getInstance("X.509");
        Certificate cert = cf.generateCertificate(fis);


        /*
        * Geting publicKey
        * */
        PublicKey publicKey = cert.getPublicKey();
        /*
        * Gets the publicKey's algorithm
        * */
        String algorithm = publicKey.getAlgorithm();
        /*
        * Generates a private key
        * */
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        SecretKey privateKey = keyGen.generateKey();

        /*
        * Creates a Cipher object to encrypt the message
        * */
        cipher.init(Cipher.ENCRYPT_MODE, privateKey);
        //Ciphers the message with the privateKey
        byte[] cipheredMessage = cipher.doFinal(arr);

        /*
        * Wraps the privateKey with the publicKey
        * */
        c.init(Cipher.WRAP_MODE, publicKey);
        byte[] arr1 = c.wrap(privateKey);

        //Stores the cipheredMessage in the file "filename.txt"
        prettyWriteFile(arr1, "key.txt");
        //Prints the cipheredMessage
        prettyPrint(cipheredMessage);
        //Stores the cipheredMessage in the file "filename.txt"
        prettyWriteFile(cipheredMessage, "cipheredMessage.txt");
    }
    // keyd é keyd encriptada e keyf é a key que decripta a keyd
    private static void dec(String file1,String keyd,String keyf, Cipher cipher, Cipher c) throws IOException, GeneralSecurityException {
        //get encripted file

        byte[] bFile = prettyReadFile(file1);

        //get encripted key
        byte[] kFile = prettyReadFile(keyd);

        //decipher key - get key from certificate
        /*
        File certificate = new File(keyf);
        FileInputStream fis = new FileInputStream(certificate);
        CertificateFactory cf = CertificateFactory.getInstance("X.509");
        Certificate cert = cf.generateCertificate(fis);
         */

        KeyStore ks = KeyStore.getInstance("PKCS12");
        ks.load(new FileInputStream(keyf), "changeit".toCharArray());
        Enumeration<String> entries = ks.aliases();
            String alias = entries.nextElement();
            //X509Certificate cert = (X509Certificate) ks.getCertificate(alias);
            PrivateKey privateCertKey = (PrivateKey) ks.getKey(alias, "changeit".toCharArray());
        /*
         * Geting publicKey
         * */

        //Unwrapping
        SecretKey privateKey = unwrap(kFile, privateCertKey, c);

        //decrypt file
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        byte[] message = cipher.doFinal(bFile);


        // Mostra a mensagem original
        String msg2 = new String(message);
        System.out.println(msg2);

    }
    private static SecretKey unwrap(byte[] blob, PrivateKey publicKey, Cipher cipher) throws GeneralSecurityException {
        cipher.init(Cipher.UNWRAP_MODE, publicKey);
        return (SecretKey) cipher.unwrap(blob, "AES", Cipher.SECRET_KEY);
    }
}
