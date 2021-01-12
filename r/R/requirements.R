`%notin%` <- Negate(`%in%`)
for(i in readLines("requirements.txt"))
{
        if(i %notin% rownames(installed.packages()))
        {
            install.packages(i,repos="https://cloud.r-project.org")
        }
}
