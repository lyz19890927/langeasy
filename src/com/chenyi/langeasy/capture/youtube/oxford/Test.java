package com.chenyi.langeasy.capture.youtube.oxford;

import java.io.FileNotFoundException;
import java.io.IOException;

import com.chenyi.langeasy.capture.youtube.ParseUtil;

public class Test {
	private static String dirPath = "E:/langeasy/lucene/youtube/oxford/";

	public static void main(String[] args) throws FileNotFoundException, IOException {
		String cpath = dirPath + "playlists.json";
		ParseUtil.count(cpath);
	}
}
