package com.jflyfox.modules.admin.folderrollpicture;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.jfinal.log.Log;
import com.jflyfox.component.util.JFlyFoxUtils;
import com.jflyfox.jfinal.base.BaseService;
import com.jflyfox.jfinal.component.annotation.ControllerBind;
import com.jflyfox.modules.admin.folder.TbFolder;
import com.jflyfox.system.log.SysLog;
import com.jflyfox.util.StrUtils;
import com.jflyfox.util.cache.Cache;
import com.jflyfox.util.cache.CacheManager;
/**
 * 栏目轮播图
 * 
 *@author zengw
 */

public class FolderrollpictureService extends BaseService{

	private final static Log log = Log.getLog(SysLog.class);

	/**
	 * 目录缓存
	 */
	private final static String cacheName = "FolderrollpictureService";

	/**
	 * 更新缓存
	 * 
	 * @author zengw
	 */
	public void updateCache() {
		CacheManager.get(cacheName).clear();
	}

	

	/**
	 * 不通过索引获取所有目录
	 * 
	 * @author zengw
	 * 
	 * @return
	 */
	public List<TbFolderRollPicture> getFolders(int siteId) {
		return TbFolderRollPicture.dao.findCache(cacheName, "getFolders_" + siteId, //
				"select * from tb_folder_roll_picture order by sort,id ");
	}

	/**
	 * 获取栏目菜单
	 * 
	 * @author zengw
	 * 
	 * @return
	 */
	public Map<String, List<TbFolderRollPicture>> getFolderMenus(int siteId) {
		Map<String, List<TbFolderRollPicture>> map = new HashMap<String, List<TbFolderRollPicture>>();
		List<TbFolderRollPicture> folders = getFolders(siteId);
		for (TbFolderRollPicture folder : folders) {
			if (folder.getStatus() == JFlyFoxUtils.STATUS_HIDE)
				continue;
			List<TbFolderRollPicture> list = new ArrayList<TbFolderRollPicture>();
			list.add(folder);
		}
		return map;
	}
}
