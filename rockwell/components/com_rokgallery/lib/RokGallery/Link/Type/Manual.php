<?php
 /**
  * @version   $Id: Manual.php 10871 2013-05-30 04:06:26Z btowles $
  * @author    RocketTheme http://www.rockettheme.com
  * @copyright Copyright (C) 2007 - 2013 RocketTheme, LLC
  * @license   http://www.gnu.org/licenses/gpl-2.0.html GNU/GPLv2 only
  */
 
class RokGallery_Link_Type_Manual extends RokGallery_Link_AbstractType
{
    public function getUrl()
    {
        return $this->link;
    }

    public function getJSONable()
    {
        $manual = new RokGallery_Link_Type_Manual_Info($this->link);
        return $manual;
    }
}
