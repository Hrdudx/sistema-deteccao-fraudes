package br.ueg.trindade.sistemariscos_fullstack;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.SQLException;
import java.util.Properties;

public class TesteDatabricks {

    public static void main(String[] args) {

        String url =
            "jdbc:databricks://dbc-665a46de-ea04.cloud.databricks.com:443"
            + ";HttpPath=/sql/1.0/warehouses/527f8d429f3661f1";

        String token = System.getenv("DATABRICKS_TOKEN");

        if (token == null || token.isBlank()) {
            System.out.println(
                "ERRO: variável DATABRICKS_TOKEN não configurada."
            );
            return;
        }

        Properties properties = new Properties();
        properties.put("PWD", token);

        try (Connection connection =
                 DriverManager.getConnection(url, properties);
             Statement statement = connection.createStatement();
             ResultSet resultSet =
                 statement.executeQuery("SELECT * FROM range(10)")) {

            System.out.println("Conexão estabelecida!");

            while (resultSet.next()) {
                System.out.println(resultSet.getLong(1));
            }

        } catch (SQLException ex) {
            System.out.println("Falha na conexão ou consulta.");
            System.out.println("Código SQL: " + ex.getSQLState());
            System.out.println("Mensagem: " + ex.getMessage());
        }
    }
}