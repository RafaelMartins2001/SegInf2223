import javax.net.ssl.*;
import java.io.*;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;

public class exercicio6b {
        public static void main(String[] args) throws IOException, CertificateException, NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
                TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
                KeyStore ks = KeyStore.getInstance("JKS");
                ks.load(new FileInputStream("CA.jks"), "changeit".toCharArray());
                tmf.init(ks);
                SSLContext sslContext = SSLContext.getInstance("TLS");
                sslContext.init(null, tmf.getTrustManagers(), null);

                SSLSocketFactory sslFactory = sslContext.getSocketFactory();


                // establish connection
                SSLSocket client = (SSLSocket) sslFactory.createSocket("www.secure-server.edu", 4433);
                client.startHandshake();
                SSLSession session = client.getSession();

                System.out.println(client.getInputStream().read());

        }
}
