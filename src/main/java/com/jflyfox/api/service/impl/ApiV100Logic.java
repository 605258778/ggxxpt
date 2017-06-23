package com.jflyfox.api.service.impl;

import java.util.List;

import com.jfinal.plugin.activerecord.Page;
import com.jflyfox.api.form.ApiResp;
import com.jflyfox.api.form.ApiForm;
import com.jflyfox.api.service.IApiLogic;
import com.jflyfox.modules.admin.article.TbArticle;
import com.jflyfox.modules.admin.folder.FolderService;
import com.jflyfox.modules.admin.folder.TbFolder;
import com.jflyfox.modules.admin.folderrollpicture.FolderrollpictureService;
import com.jflyfox.modules.admin.folderrollpicture.TbFolderRollPicture;
import com.jflyfox.modules.front.service.FrontCacheService;
import com.jflyfox.modules.front.template.TemplateService;

/**
 * Api基础方法
 * 
 * 2016年9月29日 上午11:19:00 flyfox 369191470@qq.com
 */
public class ApiV100Logic extends BaseApiLogic implements IApiLogic {

	private FrontCacheService service = new FrontCacheService();
	private FolderService folderServer = new FolderService();
	private FolderrollpictureService rollpictureService = new FolderrollpictureService();

	@Override
	public ApiResp config(ApiForm form) {
		return new ApiResp(form).addData("test", "ok");
	}

	@Override
	public ApiResp folders(ApiForm form) {
		List<TbFolder> list = folderServer.getFolders(form.getSiteId());
		return new ApiResp(form).addData("list", list);
	}
	@Override
	public ApiResp rollpicture(ApiForm form) {
		Page<TbArticle> newNews = TemplateService.articlePageTopTitle(1, 10, form.getSiteId());
		Page<TbArticle> newDynamic = TemplateService.articlePageTitle(1, 10, form.getSiteId());
		List<TbFolderRollPicture> list = rollpictureService.getFolders(form.getSiteId());
		return new ApiResp(form).addData("top_stories", list).addData("stories", newNews).addData("newDynamic", newDynamic);
	}

	@Override
	public ApiResp pageArticleSite(ApiForm form) {
		Page<TbArticle> page = service.getArticleBySiteId(form.getPaginator(), form.getInt("siteId"));
		return new ApiResp(form).addData("list", page.getList()).addData("total", page.getTotalRow());
	}

	@Override
	public ApiResp pageArticle(ApiForm form) {
		Page<TbArticle> page = service.getArticleByFolderId(form.getPaginator(), form.getFolderId());
		String background = service.getFolderImg(form.getFolderId());
		String description = service.getFolderContent(form.getFolderId());
		return new ApiResp(form).addData("stories", page.getList()).addData("total", page.getTotalRow()).addData("background", background).addData("description", description);
	}

	@Override
	public ApiResp article(ApiForm form) {
		TbArticle article = service.getArticle(form.getInt("articleId"));
		return new ApiResp(form).addData("article", article);
	}

}
