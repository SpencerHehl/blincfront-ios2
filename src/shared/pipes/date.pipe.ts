import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateAge'
})
export class DateAgePipe implements PipeTransform {
    transform(createdDateString: string): string {
        var singleDay = 1000 * 60 * 60 * 24;
        var singleHour = 1000 * 60 * 60;
        var singleMin = 1000 * 60;
        var today = new Date();
        var createdDate = new Date(createdDateString);
        var dateDiff = today.getTime() - createdDate.getTime();
        var dateDiffDays = dateDiff / singleDay;
        var agoString;
        var returnTime;
        if(dateDiffDays > 1){
            if(dateDiffDays == 1){
                agoString = "day ago"
            }else{
                agoString = "days ago"
            }
            returnTime =  Math.round(dateDiffDays).toString();
        }else{
            var dateDiffHours = dateDiff / singleHour;
            if(dateDiffHours > 1){
                if(dateDiffHours == 1){
                    agoString = "hour ago";
                }else{
                    agoString = "hours ago";
                }
                returnTime = Math.round(dateDiffHours).toString();
            }else{
                var dateDiffMins = dateDiff / singleMin;
                if(dateDiffMins > 1){
                    if(dateDiffMins == 1){
                        agoString = "min ago";
                    }else{
                        agoString = "mins ago";
                    }
                    returnTime = Math.round(dateDiffMins).toString();
                }else{
                    agoString = "s ago";
                    returnTime = Math.round((dateDiff / 1000)).toString();
                }
            }
        }
        return returnTime + " " + agoString;
    }
}