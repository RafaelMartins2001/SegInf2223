import javax.net.ssl.*;
import java.io.*;
import java.net.http.WebSocket;
import java.security.*;
import java.security.cert.CertificateException;

public class exercicio6b {
        public static void main(String[] args) throws IOException, CertificateException, NoSuchAlgorithmException, KeyStoreException, KeyManagementException, UnrecoverableKeyException {
                TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
                KeyStore ks = KeyStore.getInstance("JKS");
                InputStream fileJKS = new FileInputStream("C:/Users/Rafae/Desktop/Repositorio SegInf/SegInf2223/TP2/CA.jks");
                ks.load(fileJKS, "changeit".toCharArray());
                tmf.init(ks);
                SSLContext sslContext = SSLContext.getInstance("TLS");
                sslContext.init(null, tmf.getTrustManagers(), null);

                SSLSocketFactory sslFactory = sslContext.getSocketFactory();


                // establish connection
                SSLSocket client = (SSLSocket) sslFactory.createSocket("www.secure-server.edu", 4433);
                client.startHandshake();

                SSLSession session = client.getSession();
                BufferedReader reader = new BufferedReader(new InputStreamReader(client.getInputStream()));

                System.out.println(session.isValid());
        }
}
