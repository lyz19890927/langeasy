package com.chenyi.langeasy.capture;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.BatchUpdateException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class BookCapture {

	private static CloseableHttpClient httpclient;

	public static void main(String[] args) throws IOException, SQLException, ClassNotFoundException {
		httpclient = HttpClients.createDefault();

		// JSONObject book = getBookInfo("1688236492");

		Connection conn = CaptureUtil.getConnection();
		conn.setAutoCommit(false);
		// insertBook(conn, book);
		listBook(conn);

		conn.close();
		httpclient.close();
	}

	static String booktype = "纪录片";
	static List<String> bookidLst;

	private static void listBook(Connection conn) throws SQLException, FileNotFoundException, IOException {
		// String requestUrl =
		// "http://langeasy.com.cn/newlisten/bookResult.action?bookcells=86&bookpage=1&lrctype=&sort=1&type=%E7%BE%8E%E5%89%A7%26%E8%8B%B1%E5%89%A7";
		// HttpPost httppost = new HttpPost(requestUrl);
		//
		// CloseableHttpResponse response = httpclient.execute(httppost);
		// // Get hold of the response entity
		// HttpEntity entity = response.getEntity();
		//
		// byte[] result = null;
		// // If the response does not enclose an entity, there is no need
		// // to bother about connection release
		// if (entity != null) {
		// InputStream instream = entity.getContent();
		// result = IOUtils.toByteArray(instream);
		// instream.close();
		// }
		// response.close();

		File bookFile = new File("E:\\booklist.json");
		String sResult = IOUtils.toString(new FileInputStream(bookFile), "utf-8");

		// String sResult = new String(result, "utf-8");
		sResult = StringEscapeUtils.unescapeJava(sResult);
		// System.out.println(sResult);
		JSONArray booklist = null;
		try {
			JSONObject json = new JSONObject(sResult);
			booklist = json.getJSONArray("booklist");
			System.out.println(booklist.length());
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(sResult);
		}
		booktype = "纪录片";
		String sql = "SELECT bookid FROM book b where b.booktype='" + booktype + "' ";
		Statement st = conn.createStatement();
		ResultSet rs = st.executeQuery(sql);

		bookidLst = new ArrayList<>();
		while (rs.next()) {
			String bookid = rs.getString("bookid");
			bookidLst.add(bookid);
		}
		rs.close();
		st.close();

		insertBook(conn, booklist);
	}

	private static boolean exist(String bookid) {
		for (String bid : bookidLst) {
			if (bookid.equals(bid)) {
				return true;
			}
		}
		return false;
	}

	private static Integer insertBook(Connection conn, JSONArray booklist) throws JSONException, SQLException {
		String insertSql = "INSERT INTO book (bookid, bookname, booktype, detail, coverpath, ctime) VALUES (?, ?, ?, ?, ?, ?)";
		PreparedStatement insPs = conn.prepareStatement(insertSql);
		for (int i = 0; i < booklist.length(); i++) {
			JSONObject book = booklist.getJSONObject(i);
			String bookid = book.getString("bookid");
			if (exist(bookid)) {
				continue;
			}

			insPs.setString(1, bookid);
			insPs.setString(2, book.getString("bookname"));
			insPs.setString(3, booktype);
			insPs.setString(4, "");
			insPs.setString(5, book.getString("imagepath"));
			insPs.setTimestamp(6, new Timestamp(new Date().getTime()));
			insPs.addBatch();
		}
		try {
			insPs.executeBatch();
			conn.commit();
		} catch (BatchUpdateException exception) {
			exception.printStackTrace();
			String message = exception.getMessage();
			System.out.println(message);
			if (message.indexOf("PRIMARY") > -1) {
				System.out.println("book" + " is alreay exist.");
			} else {
				throw exception;
			}
		}

		insPs.clearBatch();
		insPs.close();

		return 0;
	}
}
